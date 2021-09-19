import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import styled from "@emotion/native";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-root-toast";

/** ===========================================================================
 * App
 * ============================================================================
 */

const STORAGE_KEY = "@@miles";

const TARGET_MILES = 25000;

export default function App() {
  const [miles, setMiles] = React.useState(0);
  const [isEdit, setEdit] = React.useState(false);

  const init = async () => {
    const miles = await getMilesAsync();
    setMiles(miles);
  };

  React.useEffect(() => {
    init();
  }, []);

  const save = async () => {
    const currentMiles = await getMilesAsync();

    await setMilesAsync(miles);
    setEdit(false);

    Toast.show(`Updated miles from ${currentMiles} to ${miles}.`, {
      duration: 6000,
    });
  };

  const cancel = () => {
    setEdit(false);
    init();
  };

  const decrementMiles = () => {
    setMiles(Math.max(miles - 1, 0));
  };

  const incrementMiles = () => {
    setMiles(miles + 1);
  };

  return (
    <RootSiblingParent>
      <Screen>
        <Title>Current Miles:</Title>
        <MilesText>{miles}</MilesText>
        <Circle>
          {isEdit ? (
            <ButtonsContainer>
              <ButtonsRow>
                <ControlButton onPress={cancel}>
                  <SmallButtonText>Cancel</SmallButtonText>
                </ControlButton>
              </ButtonsRow>
              <ButtonsRow>
                <Subtract onPress={decrementMiles}>
                  <ButtonText>-</ButtonText>
                </Subtract>
                <Add onPress={incrementMiles}>
                  <ButtonText>+</ButtonText>
                </Add>
              </ButtonsRow>
              <ButtonsRow>
                <ControlButton onPress={save}>
                  <SmallButtonText>Save</SmallButtonText>
                </ControlButton>
              </ButtonsRow>
            </ButtonsContainer>
          ) : (
            <ControlButton onPress={() => setEdit(true)}>
              <SmallButtonText>Unlock</SmallButtonText>
            </ControlButton>
          )}
        </Circle>
        <Title>Target Miles:</Title>
        <MilesText>{TARGET_MILES.toLocaleString()}</MilesText>
        <CompletionText>
          {((miles / TARGET_MILES) * 100).toFixed(2)}% complete
        </CompletionText>
        <StatusBar style="auto" />
      </Screen>
    </RootSiblingParent>
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
  margin-top: 16px;
  margin-bottom: 32px;
  width: 350px;
  height: 350px;
  border-radius: 200px;
  background-color: #faf178;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonsContainer = styled.View`
  flex-direction: column;
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.TouchableOpacity`
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
`;

const ControlButton = styled.TouchableOpacity`
  margin-top: 24px;
  margin-bottom: 24px;
  width: 128px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #25ffe9;
`;

const ButtonText = styled.Text`
  font-size: 55px;
`;

const SmallButtonText = styled.Text`
  font-size: 22px;
  font-weight: 500;
`;

const CompletionText = styled.Text`
  margin-top: 2px;
  font-size: 18px;
`;

const Add = styled(Button)`
  background: #59fa53;
  margin-left: 2px;
`;

const Subtract = styled(Button)`
  background: #f35252;
  margin-right: 2px; ;
`;
