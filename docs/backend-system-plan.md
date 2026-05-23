# Light Life 後台系統規劃（Next.js + Tailwind + Supabase）

> 目標：先完成可落地的資料庫設計、頁面規劃、功能規劃與開發步驟，不直接大改現有前台。

## 一、角色與權限設計

### 1) 角色
- **Admin（老師/女朋友）**：登入後台、管理課程、管理開課時段、查看報名、管理諮詢可預約時段、查看所有預約。
- **Student（學員）**：瀏覽課程、報名課程、查看可預約時段、提交諮詢預約。

### 2) 權限原則（Supabase RLS）
- `admin_users` 表中存在紀錄者視為管理者。
- 管理者可 CRUD：課程、開課時段、諮詢時段、報名、預約。
- 學員僅可：
  - 建立自己的報名與預約
  - 查看自己建立的報名與預約
  - 查看「公開可見」的課程與可預約時段

---

## 二、資料庫設計（Supabase）

> 主鍵使用 `uuid`，時間欄位使用 `timestamptz`，所有表包含 `created_at`、`updated_at`。

## 1) `profiles`
對應 `auth.users` 的擴充資料。

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | uuid (PK, FK -> auth.users.id) | 使用者 id |
| full_name | text | 姓名 |
| phone | text | 電話 |
| role | text | `admin` / `student` |
| created_at | timestamptz | 建立時間 |
| updated_at | timestamptz | 更新時間 |

## 2) `admin_users`
管理員白名單（可用 email 同步管理）。

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK -> auth.users.id, unique) | 管理者帳號 |
| note | text | 備註 |
| created_at | timestamptz | 建立時間 |

## 3) `courses`
課程主檔。

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | uuid (PK) | |
| title | text | 課程名稱 |
| slug | text (unique) | 路由用識別 |
| description | text | 課程介紹 |
| price | numeric | 課程費用 |
| capacity | int | 名額上限 |
| status | text | `draft` / `published` / `closed` |
| created_by | uuid (FK -> auth.users.id) | 建立者 |
| created_at | timestamptz | 建立時間 |
| updated_at | timestamptz | 更新時間 |

## 4) `course_sessions`
開課時段（同課可有多個梯次）。

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | uuid (PK) | |
| course_id | uuid (FK -> courses.id) | 所屬課程 |
| start_time | timestamptz | 開課時間 |
| end_time | timestamptz | 結束時間 |
| location | text | 線上/實體地點 |
| seats_total | int | 總席次 |
| seats_reserved | int | 已報名席次（可由 trigger 維護） |
| status | text | `open` / `full` / `closed` |
| created_at | timestamptz | 建立時間 |
| updated_at | timestamptz | 更新時間 |

## 5) `course_enrollments`
學員報名資料。

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | uuid (PK) | |
| session_id | uuid (FK -> course_sessions.id) | 報名哪一梯 |
| student_user_id | uuid (FK -> auth.users.id) | 報名者 |
| student_name | text | 報名當下姓名快照 |
| student_email | text | 報名當下 email |
| student_phone | text | 報名當下電話 |
| note | text | 備註 |
| status | text | `pending` / `confirmed` / `cancelled` |
| created_at | timestamptz | 建立時間 |
| updated_at | timestamptz | 更新時間 |

唯一鍵建議：`unique(session_id, student_user_id)`（避免重複報名同梯次）。

## 6) `consultation_slots`
身心靈諮詢可預約時段。

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | uuid (PK) | |
| start_time | timestamptz | 可預約開始 |
| end_time | timestamptz | 可預約結束 |
| is_available | boolean | 是否可預約 |
| created_by | uuid (FK -> auth.users.id) | 建立者 |
| created_at | timestamptz | 建立時間 |
| updated_at | timestamptz | 更新時間 |

## 7) `consultation_bookings`
諮詢預約紀錄。

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | uuid (PK) | |
| slot_id | uuid (FK -> consultation_slots.id, unique) | 對應時段（一時段一人） |
| student_user_id | uuid (FK -> auth.users.id) | 預約者 |
| student_name | text | 預約當下姓名快照 |
| student_email | text | 預約當下 email |
| student_phone | text | 預約當下電話 |
| topic | text | 諮詢主題 |
| status | text | `booked` / `cancelled` / `completed` |
| created_at | timestamptz | 建立時間 |
| updated_at | timestamptz | 更新時間 |

---

## 三、頁面規劃（先新增後台與流程頁，不大改現有前台）

## A. 後台（Admin）
- `/admin/login`：管理員登入
- `/admin`：儀表板（今日預約、近期開課、待確認報名）
- `/admin/courses`：課程列表、建立課程
- `/admin/courses/[id]`：課程編輯、管理開課時段
- `/admin/enrollments`：所有報名資料（可篩選課程/梯次/狀態）
- `/admin/consultation-slots`：諮詢可預約時段管理
- `/admin/bookings`：所有諮詢預約資料

## B. 學員端（可與既有前台漸進整合）
- `/courses`：沿用現有頁面，後續加入動態資料
- `/courses/[slug]`：課程詳情與梯次，提供報名按鈕
- `/my/enrollments`：我的報名
- `/consultation`：可預約時段（顯示可預約/已預約）
- `/my/bookings`：我的預約

---

## 四、功能規劃對應需求

1. **女朋友可以登入後台**
- Supabase Auth（Email OTP 或 Email+Password）。
- 登入後判斷 `admin_users` 或 `profiles.role=admin` 才可進 `/admin/*`。

2. **可以新增課程**
- 後台課程 CRUD：`courses`。

3. **可以設定開課時間**
- 在課程編輯頁管理 `course_sessions`。

4. **學員可以報名課程**
- 學員在課程梯次送出報名，寫入 `course_enrollments`。
- 檢查名額與重複報名。

5. **可以設定身心靈諮詢可預約時段**
- 後台時段管理 `consultation_slots`。

6. **預約者可以看到可預約時間與已預約時間**
- `consultation` 頁讀取時段：
  - `is_available=true` 且無 `booking` => 可預約
  - 已有 `booking` => 已預約（顯示不可選）

7. **女朋友可以在後台看到完整報名與預約資訊**
- `/admin/enrollments` 顯示完整報名清單。
- `/admin/bookings` 顯示完整預約清單。

---

## 五、技術實作建議

- Next.js App Router：
  - 前台與後台 route group 分離，例如 `(public)`、`(admin)`。
- Supabase：
  - `@supabase/supabase-js`
  - `@supabase/ssr`（server component / middleware 鑑權）
- Tailwind：
  - 後台沿用現有設計 token（cream/blush/lavender/sage/gold）
  - 資料表與表單做簡潔高可讀樣式

---

## 六、開發步驟（建議迭代）

## Phase 1：資料層與認證（不動現有前台視覺）
1. 建 Supabase 專案與環境變數（`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`）。
2. 建立 migration：上述 7 張資料表 + FK + unique + index。
3. 設定 RLS policy（admin 全權、student 僅自有資料）。
4. 建立 `/admin/login` 與 admin route guard（middleware + server check）。

## Phase 2：後台最小可用版本（MVP）
1. `/admin/courses`：新增/編輯課程。
2. `/admin/courses/[id]`：管理開課時段。
3. `/admin/enrollments`：查閱報名資料。
4. `/admin/consultation-slots`：維護可預約時段。
5. `/admin/bookings`：查閱預約資料。

## Phase 3：學員報名與預約流程
1. 課程頁接動態資料與報名表單。
2. 諮詢頁顯示可預約/已預約時段。
3. 建立 `my/enrollments` 與 `my/bookings`。

## Phase 4：品質與營運
1. 寄送通知（報名成功、預約成功）。
2. 匯出 CSV（報名、預約）。
3. 加入基本審計欄位（誰何時修改）。

---

## 七、資料查詢視圖（可選）

可在 Supabase 建 view 簡化前端查詢：
- `v_admin_enrollments_full`：報名 + 課程 + 梯次 + 學員資訊
- `v_admin_bookings_full`：預約 + 時段 + 學員資訊
- `v_consultation_slot_status`：時段 + 是否已被預約

---

## 八、風險與注意事項

- 時區統一使用 UTC 儲存，前端顯示轉為台北時區。
- 預約/報名須處理競態（同時搶位）：使用 transaction / RPC。
- RLS 是核心安全邊界，開發初期先寫測試 SQL 驗證 policy。

---

## 九、下一步（你確認後我再動手）

1. 先由我建立 Supabase SQL migration 初版。  
2. 再建立後台頁面骨架（不改你目前前台主視覺）。  
3. 最後串接「課程報名」與「諮詢預約」流程。
