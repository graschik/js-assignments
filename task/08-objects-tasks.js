'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Перед началом работы с заданием, пожалуйста ознакомьтесь с туториалом:                         *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Возвращает объект Прямоугольник (rectangle) с параметрами высота (height) и ширина (width)
 * и методом getArea(), который возвращает площадь
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    var rectangle = {};
    rectangle.width = width;
    rectangle.height = height;
    rectangle.getArea = function () {return this.height * this.width}
    return rectangle;
}


/**
 * Возвращает JSON представление объекта
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Возвращает объект указанного типа из представления JSON
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Создатель css селекторов
 *
 * Каждый комплексый селектор может состоять из эелемента, id, класса, атрибута, псевдо-класса и
 * псевдо-элемента
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Может быть несколько вхождений
 *
 * Любые варианты селекторов могут быть скомбинированы с помощью ' ','+','~','>' .
 *
 * Задача состоит в том, чтобы создать отдельный класс, независимые классы или
 * иерархию классов и реализовать функциональность
 * для создания селекторов css с использованием предоставленного cssSelectorBuilder.
 * Каждый селектор должен иметь метод stringify ()
 * для вывода строкового представления в соответствии с спецификацией css.
 *
 * Созданный cssSelectorBuilder должен использоваться как фасад
 * только для создания ваших собственных классов,
 * например, первый метод cssSelectorBuilder может быть таким:
 *
 * Дизайн класса(ов) полностью зависит от вас,
 * но постарайтесь сделать его максимально простым, понятным и читаемым насколько это возможно.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  Если нужно больше примеров - можете посмотреть юнит тесты.
 */

function makeClone(obj) {
    let clone = {}; // Создаем новый пустой объект
    for (let prop in obj) { // Перебираем все свойства копируемого объекта
        if (obj.hasOwnProperty(prop)) { // Только собственные свойства
            if ("object"===typeof obj[prop]) // Если свойство так же объект
                clone[prop] = makeClone(obj[prop]); // Делаем клон свойства
            else
                clone[prop] = obj[prop]; // Или же просто копируем значение
        }
    }
    return clone;
}

function init(obj, flag)
{
    if (obj.elementSt === undefined || flag)
        obj.elementSt = "";
    if (obj.idSt === undefined || flag)
        obj.idSt = "";
    if (obj.classSt === undefined || flag)
        obj.classSt = "";
    if (obj.attrSt === undefined || flag)
        obj.attrSt = "";
    if (obj.pseudoClassSt === undefined || flag)
        obj.pseudoClassSt = "";
    if (obj.pseudoElementSt === undefined || flag)
        obj.pseudoElementSt = "";
}

const cssSelectorBuilder = {

    element: function(value) {
        this.stringify = function ()
        {
            value = this.elementSt + this.idSt + this.classSt + this.attrSt + this.pseudoClassSt + this.pseudoElementSt;
            init(this, 1);
            return value;
        }
        init(this, 0);
        let add = makeClone(this);
        if (!(add.idSt == "" &&  add.classSt == "" &&  add.attrSt == "" &&  add.pseudoClassSt == "" &&  add.pseudoElementSt== "") && value != "")
            throw new Error("Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element");
        if (add.elementSt != "" && value != "")
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        if (value != "")
            add.elementSt = value;
        return add;
    },

    id: function(value) {
        this.stringify = function ()
        {
            value = this.elementSt + this.idSt + this.classSt + this.attrSt + this.pseudoClassSt + this.pseudoElementSt;
            init(this, 1);
            return value;
        }
        init(this, 0);
        let add = makeClone(this);
        if (!(add.classSt == "" &&  add.attrSt == "" &&  add.pseudoClassSt == "" &&  add.pseudoElementSt == ""))
            throw new Error("Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element");
        if (add.idSt != "")
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        add.idSt = add.idSt + "#" + value;
        return add;
    },

    class: function(value) {
        this.stringify = function ()
        {

            value = this.elementSt + this.idSt + this.classSt + this.attrSt + this.pseudoClassSt + this.pseudoElementSt;
            init(this, 1);
            return value;
        }
        init(this, 0);
        let add = makeClone(this);
        if (!(add.attrSt == "" &&  add.pseudoClassSt=== "" &&  add.pseudoElementSt == ""))
            throw new Error("Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element");
        add.classSt = add.classSt + "." + value;
        return add;
    },

    attr: function(value) {
        this.stringify = function ()
        {

            value = this.elementSt + this.idSt + this.classSt + this.attrSt + this.pseudoClassSt + this.pseudoElementSt;
            init(this, 1);
            return value;
        }
        init(this, 0);
        let add = makeClone(this);
        if (!(add.pseudoClassSt == "" &&  add.pseudoElementSt == ""))
            throw new Error("Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element");
        add.attrSt = "[" + value + "]";
        return add;
    },

    pseudoClass: function(value) {
        this.stringify = function ()
        {

            value = this.elementSt + this.idSt + this.classSt + this.attrSt + this.pseudoClassSt + this.pseudoElementSt;
            init(this, 1);
            return value;
        }
        init(this, 0);
        let add = makeClone(this);
        if (!(add.pseudoElementSt == ""))
            throw new Error("Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element");
        add.pseudoClassSt = add.pseudoClassSt + ":" + value;
        return add;
    },

    pseudoElement: function(value) {
        this.stringify = function ()
        {
            value = this.elementSt + this.idSt + this.classSt + this.attrSt + this.pseudoClassSt + this.pseudoElementSt;
            init(this, 1);
            return value;
        }
        init(this, 0);
        let add = makeClone(this);
        if (add.pseudoElementSt != "")
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        add.pseudoElementSt = "::" + value;
        return add;
    },

    combine: function(selector1, combinator, selector2) {
        this.stringify = function ()
        {
            return this.value;
        }
        let add = makeClone(this);
        if (selector1.value === undefined)
            add.sel1 = selector1.element("").stringify()
        else
            add.sel1 = selector1.value;
        if (selector2.value === undefined)
            add.sel2 = selector2.element("").stringify()
        else
            add.sel2 = selector2.value;
        add.value = add.sel1+ " " + combinator + " " + add.sel2;
        return add;
    }
}


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
