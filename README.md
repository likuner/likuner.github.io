## 对象继承
### ES5中的对象继承，用原型继承方式，像下面的例子：
```javascript
//father
function Rectangle(width,height,type){
    this.width = width;
    this.height = height;
    this.type = type;
}
Rectangle.prototype.result = 'success';
Rectangle.prototype.getArea = function(){
    console.info(this.type + ': ' + this.width + '*' + this.height);
};

//son
function Square(size,type){
    Rectangle.call(this,size,size,type);  //借用父类的构造函数
}
Square.prototype = new Rectangle();  //子类的原型指向父类的一个实例，new Rectanle() 不需要参数
Square.prototype.constructor = Square;  //子类原型的构造器重新指向自己
Square.prototype.say = function(){
    console.info("hello, I'm "+this.type);
};

var rect = new Rectangle(2,3,'rectanle');
console.info(rect.result);  //succcess
rect.getArea();  //rectanle: 2*3

var square = new Square(5,'square');
console.info(square.result);  //success; 继承自父类原型中的result属性
square.getArea();  //square: 5*5; getArea是继承自父类原型中的getArea方法
square.say();  //hello, I'm square; 子类原型中的方法
```
一般地，原型中只需定义功能方法，属性在构造函数中定义即可，子类也主要是继承父类的功能方法，
如果有共同的属性，可以使用“借用父类构造函数”的方式定义属性，比如result属性应该在构造函数中被定义。

### ES6中增加了class，对象继承也有了新的方式，像下面的例子：
```javascript
//father
class Rectanle{
    constructor(width,height,type){
        this.width = width;
        this.height = height;
        this.type = type;
    }
    getArea(){
        console.info(`${this.type}: ${this.width}*${this.height}`);
    }
}

//son
class Square extends Rectanle{
    constructor(size,type,flag){
        super(size,size,type);
        this.flag = flag;  //定义flag，需在super()之后，否则this报错
    }
    getFlag(){
        console.info(`flag: ${this.flag}`);
    }
}

let rect = new Rectanle(5,6,`rectanle`);
rect.getArea();  //rectanle: 5*6

let square = new Square(7,`square`,true);
square.getArea();  //square: 7*7; getArea方法继承自父类
square.getFlag();  //true; 
```
ES6中对象的继承方式，更像传统意义上类的继承，也更加严谨，更加规范，
在上面的例子中，用到了模板字符串`${}`和let，这些也是在ES6中增加的特性。





