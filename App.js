import { RecoilRoot } from "recoil";
import { RootSiblingParent } from "react-native-root-siblings";

import { Navigator } from "~components/Navigator";

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
