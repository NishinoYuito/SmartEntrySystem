-- ① テーブル作成 (入室記録テーブル)
CREATE TABLE public.entry_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL,
  registered_companion_count INT NOT NULL DEFAULT 0,
  actual_companion_count INT NOT NULL DEFAULT 0,
  entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_entry_records_visitors FOREIGN KEY(visitor_id) REFERENCES public.visitors(id)
);

-- updated_at を更新するトリガー関数を作成
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('Asia/Tokyo', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at を自動更新するトリガーを追加
CREATE TRIGGER set_timestamp_entry_records
BEFORE UPDATE ON public.entry_records
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ② RLS（行レベルセキュリティ）を無効にする
ALTER TABLE public.entry_records DISABLE ROW LEVEL SECURITY;

-- ③ 各ロールに全ての権限を付与する
GRANT ALL ON TABLE public.entry_records TO anon;