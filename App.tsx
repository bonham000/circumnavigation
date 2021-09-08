import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import styled from "@emotion/native";

/** ===========================================================================
 * App
 * ============================================================================
 */

const STORAGE_KEY = "@@miles";

export default function App() {
  const [miles, setMiles] = React.useState(0);

  React.useEffect(() => {
    const init = async () => {
      const miles = await getMilesAsync();
      setMiles(miles);
    };

    init();
  }, []);

  React.useEffect(() => {
    setMilesAsync(miles);
  });

  const decrementMiles = () => {
    setMiles(Math.max(miles - 1, 0));
  };

  const incrementMiles = () => {
    setMiles(miles + 1);
  };

  return (
    <Screen>
      <Title>Current Miles:</Title>
      <MilesText>{miles}</MilesText>
      <Circle>
        <Buttons>
          <Subtract onPress={decrementMiles}>
            <ButtonText>-</ButtonText>
          </Subtract>
          <Add onPress={incrementMiles}>
            <ButtonText>+</ButtonText>
          </Add>
        </Buttons>
      </Circle>
      <Title>Target Miles:</Title>
      <MilesText>25,000</MilesText>
      <StatusBar style="auto" />
    </Screen>
  );
}

/** ===========================================================================
 * Utils
 * ============================================================================
 */

const getMilesAsync = async (): Promise<number> => {
  try {
    const result = await AsyncStorage.getItem(STORAGE_KEY);
    const value = Number(result);
    if (result && !isNaN(value)) {
      return value;
    }
  } catch (err) {
    console.log("Error initializing miles, ", err);
  }

  return 0; // Default case
};

const setMilesAsync = async (miles: number) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, String(miles));
  } catch (err) {
    console.log("Error storing miles, ", err);
  }
};

/** ===========================================================================
 * Styles
 * ============================================================================
 */

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #46b7eb; ;
`;

const Title = styled.Text`
  font-size: 32px;
`;

const MilesText = styled(Title)`
  margin-top: 12px;
  font-weight: bold; ;
`;

const Circle = styled.View`
  margin-top: 32px;
  margin-bottom: 32px;
  width: 400px;
  height: 400px;
  border-radius: 200px;
  background-color: #faf178;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Buttons = styled.View`
  flex-direction: row;
`;

const Button = styled.TouchableOpacity`
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
`;

const ButtonText = styled.Text`
  font-size: 55px;
`;

const Add = styled(Button)`
  background: #59fa53;
  margin-left: 2px;
`;

const Subtract = styled(Button)`
  background: #f35252;
  margin-right: 2px; ;
`;
