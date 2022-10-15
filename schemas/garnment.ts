// https://fr.zalando.ch/mode-femme/
// https://fr.zalando.ch/mode-homme/

export interface GarmentInformations {
    name: string,
    description: string,
    source: string,
}

interface Dress {
    summer: GarmentInformations,
    night: GarmentInformations,
    festive: GarmentInformations,
    shirt: GarmentInformations,
    tShirt: GarmentInformations,
    sheath: GarmentInformations,
    long: GarmentInformations,
    denim: GarmentInformations,
    pull: GarmentInformations,
    cut: GarmentInformations,
    other: GarmentInformations,
}
const dress: Dress = {
    summer: { name: 'summer', description: "", source: "" },
    night: { name: 'night', description: "", source: "" },
    festive: { name: 'festive', description: "", source: "" },
    shirt: { name: 'shirt', description: "", source: "" },
    tShirt: { name: 'tshirt', description: "", source: "" },
    sheath: { name: 'sheath', description: "", source: "" },
    long: { name: 'long', description: "", source: "" },
    denim: { name: 'denim', description: "", source: "" },
    pull: { name: 'pull', description: "", source: "" },
    cut: { name: 'cut', description: "", source: "" },
    other: { name: 'dressOther', description: "", source: "" },
}

interface Top {
    tshirt: GarmentInformations,
    top: GarmentInformations,
    polo: GarmentInformations,
    long: GarmentInformations,
    other: GarmentInformations,
}
const top: Top = {
    tshirt: { name: 'tshirt', description: "", source: "" },
    top: { name: 'top', description: "", source: "" },
    polo: { name: 'polo', description: "", source: "" },
    long: { name: 'long sleeves t-shirt', description: "", source: "" },
    other: { name: 'topOther', description: "", source: "" },
}

interface Shirt {
    shirt: GarmentInformations,
    blouse: GarmentInformations,
    tunic: GarmentInformations,
    other: GarmentInformations,
}
const shirt: Shirt = {
    shirt: { name: 'shirt', description: "", source: "" },
    blouse: { name: 'blouse', description: "", source: "" },
    tunic: { name: 'tunic', description: "", source: "" },
    other: { name: 'shirtOther', description: "", source: "" },
}

interface PantJean {
    skinny: GarmentInformations,
    slim: GarmentInformations,
    right: GarmentInformations,
    large: GarmentInformations,
    bootcut: GarmentInformations,
    mom: GarmentInformations,
    short: GarmentInformations,
    other: GarmentInformations,
}
const pantJean: PantJean = {
    skinny: { name: 'jeanSkinny', description: "", source: "" },
    slim: { name: 'jeanSlim', description: "", source: "" },
    right: { name: 'jeanRight', description: "", source: "" },
    large: { name: 'jeanLarge', description: "", source: "" },
    bootcut: { name: 'jeanBootcut', description: "", source: "" },
    mom: { name: 'jeanMom', description: "", source: "" },
    short: { name: 'jeanShort', description: "", source: "" },
    other: { name: 'pantJeanOther', description: "", source: "" },
}

interface Pant {
    chino: GarmentInformations,
    pantSuit: GarmentInformations,
    legging: GarmentInformations,
    leather: GarmentInformations,
    cargo: GarmentInformations,
    jogging: GarmentInformations,
    jean: PantJean,
    other: GarmentInformations,
}
const pant: Pant = {
    chino: { name: 'chino', description: "", source: "" },
    pantSuit: { name: 'pantSuit', description: "", source: "" },
    legging: { name: 'legging', description: "", source: "" },
    leather: { name: 'leather', description: "", source: "" },
    cargo: { name: 'cargo', description: "", source: "" },
    jogging: { name: 'jogging', description: "", source: "" },
    jean: pantJean,
    other: { name: 'pantOther', description: "", source: "" },
}

interface Sweat {
    sweatshirt: GarmentInformations,
    hoodie: GarmentInformations,
    // zipper: GarmentInformations,
    fleece: GarmentInformations,
    vest: GarmentInformations,
    pull: GarmentInformations,
    other: GarmentInformations,
}
const sweat: Sweat = {
    sweatshirt: { name: 'sweatShirt', description: "", source: "" },
    hoodie: { name: 'hoodie', description: "", source: "" },
    // zipper : {name: 'zipper', description: "", source: ""},
    fleece: { name: 'fleece', description: "", source: "" },
    vest: { name: 'vest', description: "", source: "" },
    pull: { name: 'pull', description: "", source: "" },
    other: { name: 'sweatOther', description: "", source: "" },
}

interface Jacket {
    light: GarmentInformations,
    waterproof: GarmentInformations,
    leather: GarmentInformations,
    denim: GarmentInformations,
    blazer: GarmentInformations,
    cape: GarmentInformations,
    sleeveless: GarmentInformations,
    outdoor: GarmentInformations,
    track: GarmentInformations,
    winter: GarmentInformations,
    down: GarmentInformations,
    bomber: GarmentInformations,
    other: GarmentInformations,
}
const jacket: Jacket = {
    light: { name: 'light', description: "", source: "" },
    waterproof: { name: 'waterproof', description: "", source: "" },
    leather: { name: 'leather', description: "", source: "" },
    denim: { name: 'denim', description: "", source: "" },
    blazer: { name: 'blazer', description: "", source: "" },
    cape: { name: 'cape', description: "", source: "" },
    sleeveless: { name: 'sleeveless', description: "", source: "" },
    outdoor: { name: 'outdoor', description: "", source: "" },
    track: { name: 'track', description: "", source: "" },
    winter: { name: 'winter', description: "", source: "" },
    down: { name: 'down', description: "", source: "" },
    bomber: { name: 'bomber', description: "", source: "" },
    other: { name: 'jacketOther', description: "", source: "" },
}

interface Coat {
    parka: GarmentInformations,
    trench: GarmentInformations,
    short: GarmentInformations,
    classic: GarmentInformations,
    winter: GarmentInformations,
    down: GarmentInformations,
    other: GarmentInformations,
}
const coat: Coat = {
    parka: { name: 'parka', description: "", source: "" },
    trench: { name: 'trench', description: "", source: "" },
    short: { name: 'short', description: "", source: "" },
    classic: { name: 'classic', description: "", source: "" },
    winter: { name: 'winter', description: "", source: "" },
    down: { name: 'down', description: "", source: "" },
    other: { name: 'coatOther', description: "", source: "" },
}

interface Swimwear {
    bra: GarmentInformations,
    culotte: GarmentInformations,
    body: GarmentInformations,
    short: GarmentInformations,
    accessory: GarmentInformations,
    other: GarmentInformations,
}
const swimwear: Swimwear = {
    bra: { name: 'swimwearBra', description: "", source: "" },
    culotte: { name: 'swimwearCulotte', description: "", source: "" },
    body: { name: 'swimwearBody', description: "", source: "" },
    short: { name: 'swimwearShort', description: "", source: "" },
    accessory: { name: 'accessory', description: "", source: "" },
    other: { name: 'swimwearOther', description: "", source: "" },
}

interface Skirt {
    jean: GarmentInformations,
    maxi: GarmentInformations,
    pleated: GarmentInformations,
    mini: GarmentInformations,
    pencil: GarmentInformations,
    leather: GarmentInformations,
    wrap: GarmentInformations,
    other: GarmentInformations,
}
const skirt: Skirt = {
    jean: { name: 'jean', description: "", source: "" },
    maxi: { name: 'maxi', description: "", source: "" },
    pleated: { name: 'pleated', description: "", source: "" },
    mini: { name: 'mini', description: "", source: "" },
    pencil: { name: 'pencil', description: "", source: "" },
    leather: { name: 'leather', description: "", source: "" },
    wrap: { name: 'wrap', description: "", source: "" },
    other: { name: 'skirtOther', description: "", source: "" },
}

interface Short {
    jean: GarmentInformations,
    classic: GarmentInformations,
    bermuda: GarmentInformations,
    other: GarmentInformations,
}
const short: Short = {
    jean: { name: 'jean', description: "", source: "" },
    classic: { name: 'classic', description: "", source: "" },
    bermuda: { name: 'bermuda', description: "", source: "" },
    other: { name: 'shortOther', description: "", source: "" },
}

interface Jumpsuit {
    overall: GarmentInformations,
    jumpsuit: GarmentInformations,
    other: GarmentInformations,
}
const jumpsuit: Jumpsuit = {
    overall: { name: 'overall', description: "", source: "" },
    jumpsuit: { name: 'jumpsuit', description: "", source: "" },
    other: { name: 'jumpsuitOther', description: "", source: "" },
}

interface Underwear {
    bra: GarmentInformations,
    culotte: GarmentInformations,
    string: GarmentInformations,
    suspender: GarmentInformations,
    camisole: GarmentInformations,
    sculptant: GarmentInformations,
    body: GarmentInformations,
    brief: GarmentInformations,
    boxer: GarmentInformations,
    trunk: GarmentInformations,
    other: GarmentInformations,
}
const underwear: Underwear = {
    bra: { name: 'bra', description: "", source: "" },
    culotte: { name: 'culotte', description: "", source: "" },
    string: { name: 'string', description: "", source: "" },
    suspender: { name: 'suspender', description: "", source: "" },
    camisole: { name: 'camisole', description: "", source: "" },
    sculptant: { name: 'sculptant', description: "", source: "" },
    body: { name: 'body', description: "", source: "" },
    brief: { name: 'brief', description: "", source: "" },
    boxer: { name: 'boxer', description: "", source: "" },
    trunk: { name: 'trunk', description: "", source: "" },
    other: { name: 'underwearOther', description: "", source: "" },
}

interface Sock {
    sock: GarmentInformations,
    highSock: GarmentInformations,
    stocking: GarmentInformations,
    thight: GarmentInformations,
    other: GarmentInformations,
}
const sock: Sock = {
    sock: { name: 'sock', description: "", source: "" },
    highSock: { name: 'sockHigh', description: "", source: "" },
    stocking: { name: 'stocking', description: "", source: "" },
    thight: { name: 'thight', description: "", source: "" },
    other: { name: 'sockOther', description: "", source: "" },
}

interface Shoe {
    basket: GarmentInformations,
    sneaker: GarmentInformations,
    lowCut: GarmentInformations,
    ballerina: GarmentInformations,
    bootAnkle: GarmentInformations,
    bootHigh: GarmentInformations,
    pump: GarmentInformations,
    heel: GarmentInformations,
    flipflop: GarmentInformations,
    slipper: GarmentInformations,
    sandal: GarmentInformations,
    other: GarmentInformations,
}
const shoe: Shoe = {
    basket: { name: 'basket', description: "", source: "" },
    sneaker: { name: 'sneaker', description: "", source: "" },
    lowCut: { name: 'lowCut', description: "", source: "" },
    ballerina: { name: 'ballerina', description: "", source: "" },
    bootAnkle: { name: 'bootAnkle', description: "", source: "" },
    bootHigh: { name: 'bootHigh', description: "", source: "" },
    pump: { name: 'pump', description: "", source: "" },
    heel: { name: 'heel', description: "", source: "" },
    flipflop: { name: 'flipflop', description: "", source: "" },
    slipper: { name: 'slipper', description: "", source: "" },
    sandal: { name: 'sandal', description: "", source: "" },
    other: { name: 'shoeOther', description: "", source: "" },
}

interface Hat {
    hat: GarmentInformations,
    cap: GarmentInformations,
    beret: GarmentInformations,
    beanie: GarmentInformations,
    trapper: GarmentInformations,
    vizor: GarmentInformations,
    other: GarmentInformations,
}
const hat: Hat = {
    hat: { name: 'hat', description: "", source: "" },
    cap: { name: 'cap', description: "", source: "" },
    beret: { name: 'beret', description: "", source: "" },
    beanie: { name: 'beanie', description: "", source: "" },
    trapper: { name: 'trapper', description: "", source: "" },
    vizor: { name: 'vizor', description: "", source: "" },
    other: { name: 'hatOther', description: "", source: "" },
}

interface Garment {
    dress: Dress,
    top: Top,
    shirt: Shirt,
    pant: Pant,
    sweat: Sweat,
    jacket: Jacket,
    swimwear: Swimwear,
    skirt: Skirt,
    short: Short,
    jumpsuit: Jumpsuit,
    underwear: Underwear,
    sock: Sock,
    shoe: Shoe,
    hat: Hat,
}
export const Garment: Garment = {
    dress: dress,
    top: top,
    shirt: shirt,
    pant: pant,
    sweat: sweat,
    jacket: jacket,
    swimwear: swimwear,
    skirt: skirt,
    short: short,
    jumpsuit: jumpsuit,
    underwear: underwear,
    sock: sock,
    shoe: shoe,
    hat: hat,
}