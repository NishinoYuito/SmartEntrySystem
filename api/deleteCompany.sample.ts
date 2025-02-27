import { supabase } from "../utils/supabase";
// 会社を削除する関数
export const deleteCompany = async (id: string): Promise<void> => {
  const { error } = await supabase.from("company").delete().eq("id", id);
  
  if (error) {
    console.error("会社削除エラー:", error);
    throw new Error("削除に失敗しました");
  }
};