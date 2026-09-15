import pytest
import sys

if __name__ == "__main__":
    print("🚀 Running Pramaan AI Backend Forensic Engine Unit Tests...\n")
    exit_code = pytest.main(["-v", "tests/"])
    sys.exit(exit_code)
