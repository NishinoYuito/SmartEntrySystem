import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import { addCompany } from "../../api/addCompany.sample";
import { deleteCompany } from "../../api/deleteCompany.sample";
import { supabase } from "../../utils/supabase";
// 会社の型定義
type Company = {
  id: string;
  name: string;
  created_at: string;
};
const HomeScreen: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  // 会社一覧を全件取得する関数
  const fetchCompanies = useCallback(async () => {
    const { data, error } = await supabase
      .from("company")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("データ取得エラー:", error);
    } else {
      setCompanies(data as Company[]);
    }
  }, []);
  useEffect(() => {
    // 初回読み込み時に全件取得
    fetchCompanies();
    // リアルタイムで会社追加・削除時に全件再取得
    const subscription = supabase
      .channel("public:company")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "company" },
        (payload) => {
          console.log("New company added:", payload.new);
          fetchCompanies();
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "company" },
        (payload) => {
          console.log("Company deleted:", payload.old);
          fetchCompanies();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchCompanies]);
  // 会社を追加するハンドラー
  const handleAddCompany = async () => {
    await addCompany();
    fetchCompanies();
  };
  // 会社を削除するハンドラー
  const handleDeleteCompany = async (id: string) => {
    try {
      await deleteCompany(id);
      fetchCompanies();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>会社リスト</Text>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.companyRow}>
            <Text style={styles.company}>
              {item.name} - {new Date(item.created_at).toLocaleString()}
            </Text>
            <Button
              title="削除"
              onPress={() => handleDeleteCompany(item.id)}
              color="red"
            />
          </View>
        )}
      />
      <Button title="会社追加" onPress={handleAddCompany} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  company: {
    fontSize: 16,
    flex: 1,
  },
});
export default HomeScreen;