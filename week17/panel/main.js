import { createElement } from './createElement';
import TabPanel from './TabPanel.js';
import ListView from './ListView.js';

const data = [
  {
    id: 1,
    title: '蓝猫',
    url: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
  },
  {
    id: 2,
    title: '猫2',
    url: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  },
  {
    id: 3,
    title: '猫3',
    url: 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
  },
  {
    id: 4,
    title: '猫4',
    url: 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
  },
];

const component = (
  <TabPanel title="this is my Panel">
    <span title="title1">This is content1</span>
    <span title="title2">This is content2</span>
    <span title="title3">This is content3</span>
    <span title="title4">This is content4</span>
  </TabPanel>
);

// const component = (
//   <ListView data={data}>
//     {item => (
//       <figure style="width: 300px">
//         <img style="width: 100%" src={item.url} />
//         <figcaption>{item.title}</figcaption>
//       </figure>
//     )}
//   </ListView>
// );
component.mountTo(document.body);
