/**
 * Pramaan AI — Multi-Hunk Diff Parser & Code Grounding Engine
 * Accurately tracks old & new line counters across unified diff chunks
 */

export interface DiffLine {
  oldLineNumber: number | null;
  newLineNumber: number | null;
  type: "addition" | "deletion" | "context";
  content: string;
}

export interface DiffHunk {
  header: string;
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: DiffLine[];
}

export interface ParsedFileDiff {
  oldPath: string | null;
  newPath: string | null;
  hunks: DiffHunk[];
  totalAdditions: number;
  totalDeletions: number;
}

/**
 * Parse a full unified diff (git patch) containing multiple files and multiple hunks
 */
export function parseUnifiedDiff(patch: string): ParsedFileDiff[] {
  if (!patch || typeof patch !== "string") return [];

  const rawLines = patch.split("\n");
  const files: ParsedFileDiff[] = [];

  let currentFile: ParsedFileDiff | null = null;
  let currentHunk: DiffHunk | null = null;
  let currentOldLine = 0;
  let currentNewLine = 0;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];

    // 1. Detect file headers: --- a/path and +++ b/path
    if (line.startsWith("--- ")) {
      currentFile = {
        oldPath: line.slice(4).trim(),
        newPath: null,
        hunks: [],
        totalAdditions: 0,
        totalDeletions: 0,
      };
      files.push(currentFile);
      currentHunk = null;
      continue;
    }

    if (line.startsWith("+++ ") && currentFile) {
      currentFile.newPath = line.slice(4).trim();
      continue;
    }

    // 2. Detect Hunk Header: @@ -oldStart[,oldCount] +newStart[,newCount] @@ [heading]
    const hunkMatch = line.match(/^@@\s+-(\d+)(?:,(\d+))?\s+\+(\d+)(?:,(\d+))?\s+@@(.*)?$/);
    if (hunkMatch) {
      if (!currentFile) {
        currentFile = {
          oldPath: null,
          newPath: null,
          hunks: [],
          totalAdditions: 0,
          totalDeletions: 0,
        };
        files.push(currentFile);
      }

      const oldStart = parseInt(hunkMatch[1], 10);
      const oldCount = hunkMatch[2] !== undefined ? parseInt(hunkMatch[2], 10) : 1;
      const newStart = parseInt(hunkMatch[3], 10);
      const newCount = hunkMatch[4] !== undefined ? parseInt(hunkMatch[4], 10) : 1;

      currentOldLine = oldStart;
      currentNewLine = newStart;

      currentHunk = {
        header: line,
        oldStart,
        oldCount,
        newStart,
        newCount,
        lines: [],
      };
      currentFile.hunks.push(currentHunk);
      continue;
    }

    // If we haven't encountered a hunk yet, skip commit metadata / index lines
    if (!currentHunk || !currentFile) continue;

    // 3. Handle Special Diff Directives (e.g. \ No newline at end of file)
    if (line.startsWith("\\ No newline at end of file")) {
      continue;
    }

    // 4. Parse content lines inside hunk
    if (line.startsWith("+")) {
      const lineNum = currentNewLine++;
      currentHunk.lines.push({
        oldLineNumber: null,
        newLineNumber: lineNum,
        type: "addition",
        content: line.slice(1),
      });
      currentFile.totalAdditions++;
    } else if (line.startsWith("-")) {
      const lineNum = currentOldLine++;
      currentHunk.lines.push({
        oldLineNumber: lineNum,
        newLineNumber: null,
        type: "deletion",
        content: line.slice(1),
      });
      currentFile.totalDeletions++;
    } else {
      // Context line (leading space or empty)
      const oldNum = currentOldLine++;
      const newNum = currentNewLine++;
      currentHunk.lines.push({
        oldLineNumber: oldNum,
        newLineNumber: newNum,
        type: "context",
        content: line.startsWith(" ") ? line.slice(1) : line,
      });
    }
  }

  return files;
}

/**
 * Extract contiguous candidate code blocks for viva examination.
 * Handles both additions (new features/logic) and deletions (refactoring/cleanup).
 */
export function extractGroundingSnippets(
  patch: string,
  minLines = 3,
  maxLines = 25
): {
  fileSide: "new" | "old";
  lineStart: number;
  lineEnd: number;
  codeSnippet: string;
  changeType: "addition" | "deletion";
}[] {
  const parsedFiles = parseUnifiedDiff(patch);
  const candidates: any[] = [];

  for (const file of parsedFiles) {
    for (const hunk of file.hunks) {
      // Look for blocks of additions first
      let currentBlock: DiffLine[] = [];
      let blockType: "addition" | "deletion" | null = null;

      const flushBlock = () => {
        if (currentBlock.length >= minLines) {
          const isAddition = blockType === "addition";
          const start = isAddition
            ? currentBlock[0].newLineNumber!
            : currentBlock[0].oldLineNumber!;
          const end = isAddition
            ? currentBlock[currentBlock.length - 1].newLineNumber!
            : currentBlock[currentBlock.length - 1].oldLineNumber!;

          candidates.push({
            fileSide: isAddition ? "new" : "old",
            lineStart: start,
            lineEnd: end,
            codeSnippet: currentBlock.map((l) => (isAddition ? `+ ${l.content}` : `- ${l.content}`)).join("\n"),
            changeType: blockType,
          });
        }
        currentBlock = [];
        blockType = null;
      };

      for (const line of hunk.lines) {
        if (line.type === "addition") {
          if (blockType === "deletion") flushBlock();
          blockType = "addition";
          currentBlock.push(line);
          if (currentBlock.length >= maxLines) flushBlock();
        } else if (line.type === "deletion") {
          if (blockType === "addition") flushBlock();
          blockType = "deletion";
          currentBlock.push(line);
          if (currentBlock.length >= maxLines) flushBlock();
        } else {
          flushBlock();
        }
      }
      flushBlock();
    }
  }

  return candidates;
}
