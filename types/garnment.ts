// https://fr.zalando.ch/mode-femme/

interface Dress {
    summer: string,
    night: string,
    festive: string,
    shirt: string,
    tShirt: string,
    sheath: string,
    long: string,
    denim: string,
    pull: string,
    cut: string,
}
const dress: Dress = {
    summer: 'summer',
    night: 'night',
    festive: 'festive',
    shirt: 'shirt',
    tShirt: 't-shirt',
    sheath: 'sheath',
    long: 'long',
    denim: 'denim',
    pull: 'pull',
    cut: 'cut',
}

interface Top {
    tshirt: string,
    top: string,
    polo: string,
    long: string,
}
const top: Top = {
    tshirt: 't-shirt',
    top: 'top',
    polo: 'polo',
    long: 'long sleeves t-shirt',
}

interface Shirt {
    shirt: string,
    blouse: string,
    tunic: string,
}
const shirt: Shirt = {
    shirt: 'shirt',
    blouse: 'blouse',
    tunic: 'tunic',
}

interface PantJean {
    skinny: string,
    slim: string,
    right: string,
    large: string,
    bootcut: string,
    mom: string,
    short: string,
}
const pantJean: PantJean = {
    skinny: 'skinny',
    slim: 'slim',
    right: 'right',
    large: 'large',
    bootcut: 'bootcut',
    mom: 'mom',
    short: 'short',
}

interface Pant {
    chino: string,
    classic: string,
    legging: string,
    leather: string,
    cargo: string,
    jogging: string,
    // jean: PantJean,
    jean: string,
}
const pant: Pant = {
    chino: 'chino',
    classic: 'classic',
    legging: 'legging',
    leather: 'leather',
    cargo: 'cargo',
    jogging: 'jogging',
    // jean: pantJean,
    jean: 'jean',
}

interface Sweat {
    sweatshirt: string,
    hoodie: string,
    zipper: string,
    fleece: string,
    vest: string,
    pull: string,
}
const sweat: Sweat = {
    sweatshirt: 'sweatshirt',
    hoodie: 'hoodie',
    zipper: 'zipper',
    fleece: 'fleece',
    vest: 'vest',
    pull: 'pull',
}

interface Jacket {
    light: string,
    waterproof: string,
    leather: string,
    denim: string,
    blazer: string,
    cape: string,
    sleeveless: string,
    outdoor: string,
    track: string,
    winter: string,
    down: string,
    bomber: string,
}
const jacket: Jacket = {
    light: 'light',
    waterproof: 'waterproof',
    leather: 'leather',
    denim: 'denim',
    blazer: 'blazer',
    cape: 'cape',
    sleeveless: 'sleeveless',
    outdoor: 'outdoor',
    track: 'track',
    winter: 'winter',
    down: 'down',
    bomber: 'bomber',
}

interface Coat {
    parka: string,
    trench: string,
    short: string,
    classic: string,
    winter: string,
    down: string,
}
const coat: Coat = {
    parka: 'parka',
    trench: 'trench',
    short: 'short',
    classic: 'classic',
    winter: 'winter',
    down: 'down',
}

interface Swimwear {
    twoPieces: string,
    onePiece: string,
    accessory: string,
}
const swimwear: Swimwear = {
    twoPieces: 'two pieces bikini',
    onePiece: 'one piece',
    accessory: 'accessory',
}

interface Skirt {
    jean: string,
    maxi: string,
    pleated: string,
    mini: string,
    pencil: string,
    leather: string,
    wrap: string,
}
const skirt: Skirt = {
    jean: 'jean',
    maxi: 'maxi',
    pleated: 'jean',
    mini: 'mini',
    pencil: 'pencil',
    leather: 'leather',
    wrap: 'wrap',
}

interface Short {
    jean: string,
    classic: string,
    bermuda: string,
}
const short: Short = {
    jean: 'jean',
    classic: 'classic',
    bermuda: 'bermuda',
}

interface Jumpsuit {
    overall: string,
    jumpsuit: string,
}
const jumpsuit: Jumpsuit = {
    overall: 'overall',
    jumpsuit: 'jumpsuit',
}

interface Lingerie {
    bra: string,
    culotte: string,
    sets: string,
    camisole: string,
    sculptant: string,
}
const lingerie: Lingerie = {
    bra: 'bra',
    culotte: 'culotte',
    sets: 'sets',
    camisole: 'camisole',
    sculptant: 'sculptant',
}

interface Sock {
    thight: string,
    stocking: string,
    sock: string,
    highSock: string,
}
const sock: Sock = {
    thight: 'thight',
    stocking: 'stocking',
    sock: 'sock',
    highSock: 'high sock',
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
    lingerie: Lingerie,
    sock: Sock,
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
    lingerie: lingerie,
    sock: sock,
}