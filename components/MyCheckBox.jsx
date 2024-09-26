import React from
import { View, Checkbox, Text } from "react-native"

const MyCheckbox = ({ key, text, filterIncluir, setFilterIncluir }) => <View>
  <Checkbox
    value={filterIncluir.includes(key)}
    onValueChange={_v => setFilterIncluir(v => v.includes(key) ? [...v].remove(key) : [...v, key])}
  />
  <Text>{text}</Text>
</View>
export default MyCheckbox
