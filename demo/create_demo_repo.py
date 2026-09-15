import os
import shutil
import datetime
from git import Repo

def create_demo_repository(target_dir: str = "./smart-campus-app"):
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir, ignore_errors=True)

    os.makedirs(target_dir, exist_ok=True)
    repo = Repo.init(target_dir)

    base_date = datetime.datetime(2026, 10, 1, 10, 30, 0)

    # ═════════════════════════════════════════════════════
    # 1. Rohit Sharma (The Real Builder) — Incremental commits
    # ═════════════════════════════════════════════════════
    repo.config_writer().set_value("user", "name", "Rohit Sharma").release()
    repo.config_writer().set_value("user", "email", "rohit.sharma@university.edu").release()

    # Commit 1: Project init
    os.makedirs(os.path.join(target_dir, "backend/services"), exist_ok=True)
    with open(os.path.join(target_dir, "backend/main.py"), "w") as f:
        f.write("""from fastapi import FastAPI\napp = FastAPI(title="Smart Campus")\n\n@app.get("/health")\ndef health(): return {"status": "ok"}\n""")
    
    c_date = base_date.strftime("%Y-%m-%dT%H:%M:%S")
    os.environ["GIT_AUTHOR_DATE"] = c_date
    os.environ["GIT_COMMITTER_DATE"] = c_date
    repo.index.add(["backend/main.py"])
    repo.index.commit("init: FastAPI project structure with health route")

    # Commit 2: Auth Service with JWT & Refresh rotation (Tier 3 Core Logic)
    auth_file = os.path.join(target_dir, "backend/services/auth_service.py")
    with open(auth_file, "w") as f:
        f.write("""import jwt
from datetime import datetime, timedelta

class AuthService:
    def __init__(self):
        self.secret = "supersecretkey"
        self.algorithm = "HS256"

    async def create_access_token(self, user_id: str) -> str:
        payload = {"sub": user_id, "exp": datetime.utcnow() + timedelta(minutes=15)}
        return jwt.encode(payload, self.secret, algorithm=self.algorithm)

    async def rotate_refresh_token(self, user_id: str, old_token: str) -> dict:
        # Atomic lock prevents race conditions on token reuse
        lock = await self._acquire_user_lock(user_id)
        if not lock:
            raise ValueError("Concurrent refresh detected")
        try:
            await self._invalidate_token(old_token)
            return {"access": await self.create_access_token(user_id)}
        finally:
            await self._release_user_lock(user_id)

    async def _acquire_user_lock(self, user_id: str) -> bool:
        return True

    async def _invalidate_token(self, token: str):
        pass

    async def _release_user_lock(self, user_id: str):
        pass
""")
    c_date = (base_date + datetime.timedelta(days=1, hours=4)).strftime("%Y-%m-%dT%H:%M:%S")
    os.environ["GIT_AUTHOR_DATE"] = c_date
    os.environ["GIT_COMMITTER_DATE"] = c_date
    repo.index.add(["backend/services/auth_service.py"])
    repo.index.commit("feat: implement JWT auth with distributed locking for refresh token rotation")

    # Commit 3: Refactoring & debugging auth service (Churn - deleted and modified lines)
    with open(auth_file, "w") as f:
        f.write("""import jwt
from datetime import datetime, timedelta

class AuthService:
    def __init__(self):
        self.secret = "supersecretkey"
        self.algorithm = "HS256"
        self.lock_ttl = 5 # 5 seconds TTL

    async def create_access_token(self, user_id: str) -> str:
        payload = {"sub": user_id, "exp": datetime.utcnow() + timedelta(minutes=15), "type": "access"}
        return jwt.encode(payload, self.secret, algorithm=self.algorithm)

    async def rotate_refresh_token(self, user_id: str, old_token: str) -> dict:
        lock = await self._acquire_user_lock(user_id)
        if not lock:
            raise ValueError("Race condition prevented: concurrent refresh token rotation")
        try:
            await self._invalidate_token(old_token)
            new_acc = await self.create_access_token(user_id)
            return {"access_token": new_acc, "rotated_at": datetime.utcnow().isoformat()}
        finally:
            await self._release_user_lock(user_id)

    async def _acquire_user_lock(self, user_id: str) -> bool:
        # Redis distributed mutex lock
        return True

    async def _invalidate_token(self, token: str):
        # Revocation table check
        pass

    async def _release_user_lock(self, user_id: str):
        pass
""")
    c_date = (base_date + datetime.timedelta(days=2, hours=2)).strftime("%Y-%m-%dT%H:%M:%S")
    os.environ["GIT_AUTHOR_DATE"] = c_date
    os.environ["GIT_COMMITTER_DATE"] = c_date
    repo.index.add(["backend/services/auth_service.py"])
    repo.index.commit("fix: handle race condition in concurrent token refresh with redis mutex lock")

    # ═════════════════════════════════════════════════════
    # 2. Priya Patel (The Ghost Contributor) — Only docs/CSS
    # ═════════════════════════════════════════════════════
    repo.config_writer().set_value("user", "name", "Priya Patel").release()
    repo.config_writer().set_value("user", "email", "priya.p@university.edu").release()

    readme_file = os.path.join(target_dir, "README.md")
    with open(readme_file, "w") as f:
        f.write("# Smart Campus Application\nA comprehensive system for students and faculty.\n\n## Team Members\n- Rohit Sharma\n- Aryan Kumar\n- Priya Patel\n")
    
    c_date = (base_date + datetime.timedelta(days=3)).strftime("%Y-%m-%dT%H:%M:%S")
    os.environ["GIT_AUTHOR_DATE"] = c_date
    os.environ["GIT_COMMITTER_DATE"] = c_date
    repo.index.add(["README.md"])
    repo.index.commit("docs: update readme with project title and member names")

    css_file = os.path.join(target_dir, "styles.css")
    with open(css_file, "w") as f:
        f.write("body { background-color: #f0f0f0; font-family: sans-serif; }\n")
    
    c_date = (base_date + datetime.timedelta(days=5)).strftime("%Y-%m-%dT%H:%M:%S")
    os.environ["GIT_AUTHOR_DATE"] = c_date
    os.environ["GIT_COMMITTER_DATE"] = c_date
    repo.index.add(["styles.css"])
    repo.index.commit("style: update basic colors")

    # ═════════════════════════════════════════════════════
    # 3. Aryan Kumar (The Big Bang Dumper) — 3:42 AM dump, 0 deletions
    # ═════════════════════════════════════════════════════
    repo.config_writer().set_value("user", "name", "Aryan Kumar").release()
    repo.config_writer().set_value("user", "email", "aryan.kumar.dev@gmail.com").release()

    # Monolithic dump file of 2000 lines
    dump_file = os.path.join(target_dir, "frontend_template_dump.js")
    with open(dump_file, "w") as f:
        lines = [f"// Template component line {i}\nconst Component{i} = () => {{ return <div>Line {i}</div>; }};" for i in range(1800)]
        f.write("\n".join(lines))

    # Day 14 at 03:42 AM
    c_date = (base_date + datetime.timedelta(days=13, hours=17, minutes=12)).strftime("%Y-%m-%dT%H:%M:%S")
    os.environ["GIT_AUTHOR_DATE"] = c_date
    os.environ["GIT_COMMITTER_DATE"] = c_date
    repo.index.add(["frontend_template_dump.js"])
    repo.index.commit("added frontend")

    print(f"[OK] Demo repository successfully created at: {os.path.abspath(target_dir)}")

if __name__ == "__main__":
    create_demo_repository()
