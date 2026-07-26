# Deploying Adminer on the ENCS Web Server (AITS)

This documents the steps used to host a web-accessible Adminer GUI on
Concordia's ENCS/AITS server for the CSCS project, connecting to the
group's `wqc353_1` database.

## Prerequisites

- Concordia VPN connected (required if off the ENCS network — ENCS
  blocks direct external connections)
- Your **personal** ENCS username/password (e.g. `a_chenit`) — used for SSH
- The **group** DB credentials from the AITS course email — used later,
  inside Adminer itself:
  - DB host: `wqc353.encs.concordia.ca`
  - DB user: `wqc353_1`
  - DB password: (from the AITS email)
  - Database: `wqc353_1`

These are two different credential sets — don't mix them up (see the table
at the end of this doc).

## 1. Connect to the ENCS login server via SSH

```bash
ssh a_chenit@login.encs.concordia.ca
```

Replace `a_chenit` with your own ENCS username. Enter your **personal**
ENCS password when prompted (not the `wqc353_1` DB password).

Note: `login.encs.concordia.ca` is the general ENCS login host — separate
from `wqc353.encs.concordia.ca`, which is the host serving this course's
database and web pages.

## 2. Navigate to the group's web-visible directory

```bash
cd /www/groups/w/wq_comp353_1
```

Only files placed here are reachable over HTTP(S). The sibling directory
`/groups/w/wq_comp353_1` (no `www`) is for working files only and is
**not** web-visible.

## 3. Download Adminer

First attempt (didn't work — see Troubleshooting below):

```bash
curl -o adminer.php https://www.adminer.org/latest.php
```

Working version — `adminer.org/latest.php` redirects to the real
download, so `-L` (follow redirects) is required:

```bash
curl -L -o adminer.php https://www.adminer.org/latest.php
```

## 4. Verify the download

```bash
ls -la adminer.php
head -5 adminer.php
```

- File size should be in the hundreds of KB (not a few hundred bytes)
- First line should be `<?php`, not HTML

## 5. Check permissions and group ownership

```bash
ls -la /www/groups/w/wq_comp353_1/
```

Expected: `adminer.php` owned by your ENCS user, group `wqc353_1`
(inherited automatically via the sgid bit on the parent directory). If
group ownership or permissions look wrong:

```bash
chmod g+s /www/groups/w/wq_comp353_1
chmod 644 /www/groups/w/wq_comp353_1/adminer.php
```

## 6. Open Adminer in the browser

```
https://wqc353.encs.concordia.ca/adminer.php
```

(VPN required if off-campus. Must be `https`, not `http` — the server
redirects automatically but go straight to `https` to avoid the extra hop.)

## 7. Log in on the Adminer page

Use the **group DB credentials** from the AITS email, not your personal
ENCS login:

| Field    | Value                      |
| -------- | -------------------------- |
| System   | MySQL                      |
| Server   | `wqc353.encs.concordia.ca` |
| Username | `wqc353_1`                 |
| Password | (from the AITS email)      |
| Database | `wqc353_1`                 |

If `wqc353.encs.concordia.ca` doesn't work as the server value, try
`localhost` (Adminer and MySQL run on the same box in this setup).

You should now see all tables in `wqc353_1` (Location, Personnel,
ClubMember, Payment, FIFAGame, etc.).

## Troubleshooting log (issues actually hit, and fixes)

### 404 Not Found when visiting the URL

**Cause found:** `adminer.php` existed but was only 110 bytes — `curl`
without `-L` saved the redirect response instead of the actual file, so
the browser was loading a real-but-broken file, not a missing one.

**Fix:** re-download with `-L`:

```bash
curl -L -o adminer.php https://www.adminer.org/latest.php
```

If `-L` still doesn't produce a valid file, fall back to a direct GitHub
release link instead of the adminer.org redirector:

```bash
curl -L -o adminer.php https://github.com/vrana/adminer/releases/latest/download/adminer.php
```

## Credential quick-reference

| Step                                  | Which credentials to use              |
| ------------------------------------- | ------------------------------------- |
| SSH into `login.encs.concordia.ca`    | Your personal ENCS username/password  |
| Adminer's login page (in the browser) | Group `wqc353_1` DB username/password |

## Security note

`adminer.php` is a live, publicly reachable database admin panel once
deployed — anyone with the URL and the `wqc353_1` DB password (same
access level as direct DB access, not broader) can read/edit the data.
Consider deleting the file from the server once the project is graded:

```bash
rm /www/groups/w/wq_comp353_1/adminer.php
```
