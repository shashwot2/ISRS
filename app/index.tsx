import { Text, View, Button, FlatList, ActivityIndicator } from "react-native";
import React, { useState } from "react";

export default function Index() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://getdecks-lnzzppfnpq-uc.a.run.app');
      const json = await response.json();
      console.log(json)
      setData(json);
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="Fetch Data" onPress={fetchData} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {data && (
        <View>
          <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>
            Deck Name: {data[0].deckName}
          </Text>
          <Text>Deck ID: {data.id}</Text>
          <FlatList
            data={data[0].cards}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={{ marginVertical: 5 }}>Card: {item}</Text>
            )}
          />
        </View>
      )}
    </View>
  );
}
