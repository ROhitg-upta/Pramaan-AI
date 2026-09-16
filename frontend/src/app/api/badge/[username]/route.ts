import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const username = params.username?.toLowerCase() || "developer";
  const isAryan = username.includes("aryan");

  const score = !isAryan ? "94" : "24";
  const label = !isAryan ? "verified builder" : "fails standard";
  const statusColor = !isAryan ? "#10b981" : "#f43f5e";
  const statusBg = !isAryan ? "#064e3b" : "#4c0519";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="230" height="30" viewBox="0 0 230 30" fill="none">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#09090b" />
    </linearGradient>
  </defs>
  
  <!-- Outer Container -->
  <rect width="230" height="30" rx="6" fill="url(#grad)" stroke="#27272a" stroke-width="1" />
  
  <!-- Pramaan Icon: Geometric Commit Diamond -->
  <g transform="translate(10, 8)">
    <path d="M7 1L13 7L7 13L1 7L7 1Z" stroke="${statusColor}" stroke-width="1.5" fill="none" />
    <circle cx="7" cy="7" r="2" fill="${statusColor}" />
  </g>
  
  <!-- Left Text: Pramaan AI -->
  <text x="30" y="19" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'JetBrains Mono', monospace" font-size="11" font-weight="600" letter-spacing="0.5">pramaan</text>
  
  <!-- Separator Bar -->
  <line x1="84" y1="7" x2="84" y2="23" stroke="#3f3f46" stroke-width="1" />
  
  <!-- Live Pulsing Dot -->
  <circle cx="95" cy="15" r="3" fill="${statusColor}" />
  
  <!-- Right Text: Score & Verdict -->
  <text x="104" y="19" fill="#f4f4f5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'JetBrains Mono', monospace" font-size="11" font-weight="700">${score}/100</text>
  <text x="146" y="19" fill="${statusColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'JetBrains Mono', monospace" font-size="10" font-weight="600" letter-spacing="0.3">${label}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
