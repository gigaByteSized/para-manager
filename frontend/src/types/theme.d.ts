// types
type TColor =
    | 'white'
    | 'gray1'
    | 'gray2'
    | 'black'
    | 'blue'
    | 'green'
    | 'darkGreen'
    | 'textBlack'
    | 'textGray'
    | 'negativeRed'

type IColor = {
    [key in TColor]: string
}

type TFont = 'sourceSansPro' | 'quicksand'
type IFont = {
    [key in TFont]: string
}