-- ① テーブル作成
CREATE TABLE IF NOT EXISTS public.company (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
-- ② RLS（行レベルセキュリティ）を無効にする
ALTER TABLE public.company DISABLE ROW LEVEL SECURITY;
-- ③ 各ロールに全ての権限を付与する
GRANT ALL ON TABLE public.company TO anon;
