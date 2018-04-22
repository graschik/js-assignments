'use strict';

/**
 * Возвращает массив из 32 делений катушки компаса с названиями.
 * Смотрите детали здесь:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Пример возвращаемого значения :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 *
 */

function createCompassPoints() {
    var sides = ['N','E','S','W'];  // use array of cardinal directions only!
    var arr = [
    { abbreviation : 'N',     azimuth :   0.00 },
    { abbreviation : 'NbE',   azimuth :  11.25 },
    { abbreviation : 'NNE',   azimuth :  22.50 },
    { abbreviation : 'NEbN',  azimuth :  33.75 },

    { abbreviation : 'NE',    azimuth :  45.00 },
    { abbreviation : 'NEbE',  azimuth :  56.25 },
    { abbreviation : 'ENE',   azimuth :  67.50 },
    { abbreviation : 'EbN',   azimuth :  78.75 },

    { abbreviation : 'E',     azimuth :  90.00 },
    { abbreviation : 'EbS',   azimuth : 101.25 },
    { abbreviation : 'ESE',   azimuth : 112.50 },
    { abbreviation : 'SEbE',  azimuth : 123.75 },

    { abbreviation : 'SE',    azimuth : 135.00 },
    { abbreviation : 'SEbS',  azimuth : 146.25 },
    { abbreviation : 'SSE',   azimuth : 157.50 },
    { abbreviation : 'SbE',   azimuth : 168.75 },

    { abbreviation : 'S',     azimuth : 180.00 },
    { abbreviation : 'SbW',   azimuth : 191.25 },
    { abbreviation : 'SSW',   azimuth : 202.50 },
    { abbreviation : 'SWbS',  azimuth : 213.75 },

    { abbreviation : 'SW',    azimuth : 225.00 },
    { abbreviation : 'SWbW',  azimuth : 236.25 },
    { abbreviation : 'WSW',   azimuth : 247.50 },
    { abbreviation : 'WbS',   azimuth : 258.75 },

    { abbreviation : 'W',     azimuth : 270.00 },
    { abbreviation : 'WbN',   azimuth : 281.25 },
    { abbreviation : 'WNW',   azimuth : 292.50 },
    { abbreviation : 'NWbW',  azimuth : 303.75 },

    { abbreviation : 'NW',    azimuth : 315.00 },
    { abbreviation : 'NWbN',  azimuth : 326.25 },
    { abbreviation : 'NNW',   azimuth : 337.50 },
    { abbreviation : 'NbW',   azimuth : 348.75 }

    ];
    return arr;
}


/**
 * Раскройте фигурные скобки указанной строки.
 * Смотрите https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * Во входной строке пары фигурных скобок, содержащие разделенные запятыми подстроки,
 * представляют наборы подстрок, которые могут появиться в этой позиции на выходе.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * К СВЕДЕНИЮ: Порядок выходных строк не имеет значения.
 *
 * Пример:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    let expanded = [str];
    const bracedSubstringRegex = /\{[^\{\}]*?\}/g;
    let hasFinished = false;
    while (!hasFinished) {
        hasFinished = true;
        let newExpanded = [];
        for (let string of expanded) {
            let matches = string.match(bracedSubstringRegex);
            if (matches) {
                hasFinished = false;
                let options = matches[0].slice(1, -1).split(',');
                for (let option of options) {
                    newExpanded.push(string.replace(matches[0], option));
                }
            } else {
                newExpanded.push(string);
            }
        }
        expanded = newExpanded;
    }
    expanded = [...new Set(expanded)];
    for (let string of expanded) {
        yield string;
    }
}


/**
 * Возвращает ZigZag матрицу
 *
 * Основная идея в алгоритме сжатия JPEG -- отсортировать коэффициенты заданного изображения зигзагом и закодировать их.
 * В этом задании вам нужно реализовать простой метод для создания квадратной ZigZag матрицы.
 * Детали смотрите здесь: https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * https://ru.wikipedia.org/wiki/JPEG
 * Отсортированные зигзагом элементы расположаться так: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - размер матрицы
 * @return {array}  массив размером n x n с зигзагообразным путем
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    var height = n;
    var width = n;

    var mtx = [];
    for (var i = 0; i < n; i++)
        mtx[i] = [];

    var i=1, j=1;
    for (var e = 0; e < n*n; e++) {
        mtx[i-1][j-1] = e;
        if ((i + j) % 2 == 0) {
            // Even stripes
            if (j < n) j ++;
            else       i += 2;
            if (i > 1) i --;
        } else {
            // Odd stripes
            if (i < n) i ++;
            else       j += 2;
            if (j > 1) j --;
        }
    }
    return mtx;
}


/**
 * Возвращает true если заданный набор костяшек домино может быть расположен в ряд по правилам игры.
 * Детали игры домино смотрите тут: https://en.wikipedia.org/wiki/Dominoes
 * https://ru.wikipedia.org/wiki/%D0%94%D0%BE%D0%BC%D0%B8%D0%BD%D0%BE
 * Каждая костяшка представлена как массив [x,y] из значений на ней.
 * Например, набор [1, 1], [2, 2], [1, 2] может быть расположен в ряд ([1, 1] -> [1, 2] -> [2, 2]),
 * тогда как набор [1, 1], [0, 3], [1, 4] не может.
 * К СВЕДЕНИЮ: в домино любая пара [i, j] может быть перевернута и представлена как [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    const result = [[]];
    result[0] = dominoes.shift();
    let lastLength = 0;
    while (lastLength != dominoes.length && dominoes.length > 0) {
        lastLength = dominoes.length;
        for (let i = 0; i < dominoes.length; i++) {
            if (result[result.length - 1][1] == dominoes[i][0] && result[result.length - 1][0] != dominoes[i][1]) {
                result[result.length] = dominoes[i];
                dominoes.splice(i, 1);
                } else if (result[result.length - 1][1] == dominoes[i][1] && result[result.length - 1][0] != dominoes[i][1]) {
                    result[result.length] = dominoes[i].reverse();
                    dominoes.splice(i, 1);
                }
        }
    };
    return !dominoes.length;
}


/**
 * Возвращает строковое представление заданного упорядоченного списка целых чисел.
 *
 * Строковое представление списка целых чисел будет состоять из элементов, разделенных запятыми. Элементами могут быть:
 *   - отдельное целое число
 *   - или диапазон целых чисел, заданный начальным числом, отделенным от конечного числа черточкой('-').
 *     (Диапазон включает все целые числа в интервале, включая начальное и конечное число)
 *     Синтаксис диапазона должен быть использован для любого диапазона, где больше двух чисел.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let result = "";
    let i = 1, start, end;
    while(i < nums.length ){
        start = nums[i - 1];
        let isGo = false;
        while (i < nums.length && nums[i - 1] + 1 == nums[i]) {
            i++;
            isGo = true;
        }
        end = start != nums[i - 1] ? nums[i - 1] : "";
        i++;
        result += start.toString();
        if (start + 1 == end)
            result += "," + end.toString();
        else
        if (isGo)
            result += "-" + end.toString();
        else
        if (end != "")
            result += "," + end.toString();
        if (i < nums.length)
            result += ",";
    }
    return result ;
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
