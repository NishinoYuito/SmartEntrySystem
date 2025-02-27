import { supabase } from "../utils/supabase";
// 新しい会社を追加
export async function addCompany() {
  const name = `Company_${Math.floor(Math.random() * 1000)}`;
  const { data, error } = await supabase.from("company").insert([{ name }]).select();

  if (error) {
    console.error("Error inserting company:", error);
    return null;
  }

  console.log("Company added successfully:", data);
  return data;
}