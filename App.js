import { RecoilRoot } from "recoil";
import Navigator from "./src/utils/Navigator";
import { RootSiblingParent } from "react-native-root-siblings";

const App = () => {
  return (
    <RecoilRoot>
      <RootSiblingParent>
        <Navigator />
      </RootSiblingParent>
    </RecoilRoot>
  );
};

export default App;
