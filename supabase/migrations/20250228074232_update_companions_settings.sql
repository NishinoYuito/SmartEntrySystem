-- companionsテーブルのRLSを無効化する
ALTER TABLE public.companions DISABLE ROW LEVEL SECURITY;

-- companionsテーブルに全ての権限を付与する
GRANT ALL ON TABLE public.companions TO anon;