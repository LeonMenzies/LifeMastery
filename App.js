import { RootSiblingParent } from "react-native-root-siblings";

import { Navigator } from "~components/navigator/Navigator";

const App = () => {
  return (
    <RootSiblingParent>
      <Navigator />
    </RootSiblingParent>
  );
};

export default App;
