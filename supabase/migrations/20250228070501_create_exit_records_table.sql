-- ① テーブル作成 (退室記録テーブル)
CREATE TABLE public.exit_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_record_id UUID NOT NULL,
  exit_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  meeting_person VARCHAR(100) NOT NULL,
  confirmed_person VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_exit_records_entry_records FOREIGN KEY(entry_record_id) REFERENCES public.entry_records(id)
);

-- updated_at を自動更新するトリガーを追加
CREATE TRIGGER set_timestamp_exit_records
BEFORE UPDATE ON public.exit_records
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ② RLS（行レベルセキュリティ）を無効にする
ALTER TABLE public.exit_records DISABLE ROW LEVEL SECURITY;

-- ③ 各ロールに全ての権限を付与する
GRANT ALL ON TABLE public.exit_records TO anon;