# gmsoft-express - 表达式执行器

[![NPM](https://img.shields.io/npm/v/gmsoft-express.svg)](https://www.npmjs.com/package/gmsoft-express)
[![DOWNLOAD](https://img.shields.io/npm/dt/gmsoft-express.svg)](https://www.npmjs.com/package/gmsoft-express)

## How  

``` shell

  yarn add gmsoft-express

```

## PeerDependencies  

``` JSON

  "peerDependencies": {
    "gmsoft-tools": "^1.0.10",
    "lodash": "^4.17.15"
  },

```

## Why  

· 大数运算优化  
· 轻量化（功能少
  
## Dev  

``` shell

  #start build
  $ yarn start
  #start example
  $ cd example\gm-express-example
  $ yarn start

```

## Tools

### exeExpress 执行表达式  
``` js  
  import { exeExpress } from 'gmsoft-express';

  exeExpress('20000>=1000&&20000<1000000');
  // => true

```
### fillLimit 填充表达式  
``` js  
  import { fillLimit } from 'gmsoft-express';
  
  fillLimit('sum<=1','sum','2000');
  // => '2000<=1'
  fillLimit('sum<=1&&amount>=10',{sum:'1000',amount:'2'});
  // => '1000<=1&&2>=10'

```
### limitToMsg 语义化表达式  
``` js  
  import { limitToMsg } from 'gmsoft-express';
  
  limitToMsg('sum<=1','sum','采购金额');
  // =>  => '采购金额小于等于1'
  limitToMsg('sum<=1&&amount>=10',{sum:'采购金额',amount:'数量'});
  // => '采购金额<=1并且数量大于等于10'

```
### getCustomExpressReg 生成正则  
``` js  
  import { getCustomExpressReg } from 'gmsoft-express';
  
  getCustomExpressReg('amount');
  // => /^(amount(<|<=|>|>=|=)\d+)((&&|\|\|)(amount(<|<=|>|>=|=)\d+))*$/
  getCustomExpressReg(['amount','sum']);
  //=> /^(amount(<|<=|>|>=|=)\d+)((&&|\|\|)(sum(<|<=|>|>=|=)\d+))*$/

```
### getExpressionLooseRange 取出表达式的宽松区间  
``` js  
  import { getExpressionLooseRange } from 'gmsoft-express';
  
  getExpressionLooseRange('sum>200&&sum<1&&sum>1000000','sum');
  // => {__lt__: "1", __gt__: "200"}
  getExpressionLooseRange(['sum>200&&sum<1','sum>1000000&&sum>1'],'sum');
  //=> {__lt__: "1", __gt__: "1"}

```
### doCompareWithExpressionRange 将值 与 区间 进行比较  
``` js  
  import { doCompareWithExpressionRange } from 'gmsoft-express';
  
  doCompareWithExpressionRange({__lt__: "1000", __gt__: "200"},'1000');
  // => false
  doCompareWithExpressionRange({__lt__: "1000", __gt__: "200"},'999');
  // => true

```

## 参考资料

- [lodash](https://github.com/lodash/lodash)  