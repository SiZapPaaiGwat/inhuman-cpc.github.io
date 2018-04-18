# React Native跨平台APP开发

---

## 快速开始

仅使用JavaScript构建移动应用程序；它使用与React相同的设计，让您从声明性组件构建丰富的移动UI。

```js
import React, { Component } from 'react';
import { Text, View } from 'react-native';

class WhyReactNativeIsSoGreat extends Component {
  render() {
    return (
      <View>
        <Text>
          If you like React on the web, you'll like React Native.
        </Text>
        <Text>
          You just use native components like 'View' and 'Text',
          instead of web components like 'div' and 'span'.
        </Text>
      </View>
    );
  }
}
```

---

## Native & Not Web App & Using JavaScript

```js
import React, { Component } from 'react';
import { Image, ScrollView, Text } from 'react-native';

class AwkwardScrollingImageWithText extends Component {
  render() {
    return (
      <ScrollView>
        <Image
          source={{uri: 'https://i.chzbgr.com/full/7345954048/h7E2C65F9/'}}
          style={{width: 320, height:180}}
        />
        <Text>
          On iOS, a React Native ScrollView uses a native UIScrollView.
          On Android, it uses a native ScrollView.

          On iOS, a React Native Image uses a native UIImageView.
          On Android, it uses a native ImageView.

          React Native wraps the fundamental native components, giving you
          the performance of a native app, plus the clean design of React.
        </Text>
      </ScrollView>
    );
  }
}
```

---

## 快速开发

Hot Reloading

![](https://media.giphy.com/media/13WZniThXy0hSE/giphy.gif)

---

## 与原生代码共存

```js
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { TheGreatestComponentInTheWorld } from './your-native-code';

class SomethingFast extends Component {
  render() {
    return (
      <View>
        <TheGreatestComponentInTheWorld />
        <Text>
          TheGreatestComponentInTheWorld could use native Objective-C,
          Java, or Swift - the product development process is the same.
        </Text>
      </View>
    );
  }
}
```

---

## 谁在使用

- Facebook
- Instagram
- Skype
- Airbnb
- QQ
- JD

https://facebook.github.io/react-native/showcase.html

---

## 快速安装

create-react-native-app 是一个无需安装xcode 或者 android studio 的社区工具，用于快速开发。如果你的应用不依赖于原生代码则尽可使用。

```shell
npm install -g create-react-native-app
create-react-native-app AwesomeProject
cd AwesomeProject
npm start
```

---

## Expo

- iOS AppStore 搜索 Expo
- Android 使用[安装包](https://www.apkmonk.com/app/host.exp.exponent/)



**快速开始Demo吧**

---

## Style

```js
export default class LotsOfStyles extends Component {
  render() {
    return (
      <View>
        <Text style={styles.red}>just red</Text>
        <Text style={[styles.bigblue, styles.red]}>bigblue, then red</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bigblue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
});
```

---

## 输入事件

```js
export default class PizzaTranslator extends Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  render() {
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to translate!"
          onChangeText={(text) => this.setState({text})}
        />
        <Text style={{padding: 10, fontSize: 42}}>
          {this.state.text.split(' ').map((word) => word && '🍕').join(' ')}
        </Text>
      </View>
    );
  }
}
```

---

## 点击事件

```js
<Button
  onPress={() => {
    Alert.alert('You tapped the button!');
  }}
  title="Press Me"
/>
```

- TouchableHighlight
- TouchableNativeFeedback
- TouchableOpacity
- TouchableWithouFeedback

---

## ScrollView

```js
import React, { Component } from 'react';
import { AppRegistry, ScrollView, Image, Text } from 'react-native';

export default class IScrolledDownAndWhatHappenedNextShockedMe extends Component {
  render() {
      return (
        <ScrollView>
          <Text style={{fontSize:96}}>Scroll me plz</Text>
          <Image source={require('/react-native/img/favicon.png')} />
          <Image source={require('/react-native/img/favicon.png')} />
          <Image source={require('/react-native/img/favicon.png')} />
          <Text style={{fontSize:80}}>React Native</Text>
        </ScrollView>
    );
  }
}

// skip these lines if using Create React Native App
AppRegistry.registerComponent('AwesomeProject',() => IScrolledDownAndWhatHappenedNextShockedMe);
```

---

## List Views

```js
mport React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, Text, View } from 'react-native';

export default class FlatListBasics extends Component {
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[
            {key: 'Devin'},
            {key: 'Jackson'},
            {key: 'Julie'},
          ]}
          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
        />
      </View>
    );
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => FlatListBasics);
```

---

## 网络请求

```js
fetch('https://mywebsite.com/endpoint/', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue',
  }),
})
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.movies;
    })
    .catch((error) => {
      console.error(error);
    });
```

---

## WebSocket

```js
var ws = new WebSocket('ws://host.com/path');

ws.onopen = () => {
  // connection opened
  ws.send('something'); // send a message
};
ws.onmessage = (e) => {
  // a message was received
  console.log(e.data);
};
ws.onerror = (e) => {
  // an error occurred
  console.log(e.message);
};
ws.onclose = (e) => {
  // connection closed
  console.log(e.code, e.reason);
};
```

---

## 实战训练

> 将秒表功能移植到 React Native

---

## Resources

- https://facebook.github.io/react-native/docs/getting-started.html

---

## 课后习题 - 一个简易移动端浏览器

![image-20180418113632286](https://tinypng.com/web/output/h6e0e9156bcy8wgpgzu5b071b54heqx0/image-20180418113632286.png)

