// ISO 4217 Currency Data - Complete World Currencies with Country Flags (180+)
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimalDigits: number;
  country: string;
  flag: string;
}

export const currencies: Currency[] = [
  // ===== A =====
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", decimalDigits: 2, country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "AFN", name: "Afghan Afghani", symbol: "؋", decimalDigits: 2, country: "Afghanistan", flag: "🇦🇫" },
  { code: "ALL", name: "Albanian Lek", symbol: "L", decimalDigits: 2, country: "Albania", flag: "🇦🇱" },
  { code: "AMD", name: "Armenian Dram", symbol: "֏", decimalDigits: 2, country: "Armenia", flag: "🇦🇲" },
  { code: "ANG", name: "Netherlands Antillean Guilder", symbol: "ƒ", decimalDigits: 2, country: "Curaçao", flag: "🇨🇼" },
  { code: "AOA", name: "Angolan Kwanza", symbol: "Kz", decimalDigits: 2, country: "Angola", flag: "🇦🇴" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", decimalDigits: 2, country: "Argentina", flag: "🇦🇷" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", decimalDigits: 2, country: "Australia", flag: "🇦🇺" },
  { code: "AWG", name: "Aruban Florin", symbol: "ƒ", decimalDigits: 2, country: "Aruba", flag: "🇦🇼" },
  { code: "AZN", name: "Azerbaijani Manat", symbol: "ман", decimalDigits: 2, country: "Azerbaijan", flag: "🇦🇿" },

  // ===== B =====
  { code: "BAM", name: "Bosnia-Herzegovina Mark", symbol: "KM", decimalDigits: 2, country: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "BBD", name: "Barbadian Dollar", symbol: "Bds$", decimalDigits: 2, country: "Barbados", flag: "🇧🇧" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", decimalDigits: 2, country: "Bangladesh", flag: "🇧🇩" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", decimalDigits: 2, country: "Bulgaria", flag: "🇧🇬" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "BD", decimalDigits: 3, country: "Bahrain", flag: "🇧🇭" },
  { code: "BIF", name: "Burundian Franc", symbol: "FBu", decimalDigits: 0, country: "Burundi", flag: "🇧🇮" },
  { code: "BMD", name: "Bermudian Dollar", symbol: "BD$", decimalDigits: 2, country: "Bermuda", flag: "🇧🇲" },
  { code: "BND", name: "Brunei Dollar", symbol: "B$", decimalDigits: 2, country: "Brunei", flag: "🇧🇳" },
  { code: "BOB", name: "Bolivian Boliviano", symbol: "Bs.", decimalDigits: 2, country: "Bolivia", flag: "🇧🇴" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", decimalDigits: 2, country: "Brazil", flag: "🇧🇷" },
  { code: "BSD", name: "Bahamian Dollar", symbol: "B$", decimalDigits: 2, country: "Bahamas", flag: "🇧🇸" },
  { code: "BTN", name: "Bhutanese Ngultrum", symbol: "Nu.", decimalDigits: 2, country: "Bhutan", flag: "🇧🇹" },
  { code: "BWP", name: "Botswanan Pula", symbol: "P", decimalDigits: 2, country: "Botswana", flag: "🇧🇼" },
  { code: "BYN", name: "Belarusian Ruble", symbol: "Br", decimalDigits: 2, country: "Belarus", flag: "🇧🇾" },
  { code: "BZD", name: "Belize Dollar", symbol: "BZ$", decimalDigits: 2, country: "Belize", flag: "🇧🇿" },

  // ===== C =====
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", decimalDigits: 2, country: "Canada", flag: "🇨🇦" },
  { code: "CDF", name: "Congolese Franc", symbol: "FC", decimalDigits: 2, country: "DR Congo", flag: "🇨🇩" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", decimalDigits: 2, country: "Switzerland", flag: "🇨🇭" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", decimalDigits: 0, country: "Chile", flag: "🇨🇱" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", decimalDigits: 2, country: "China", flag: "🇨🇳" },
  { code: "COP", name: "Colombian Peso", symbol: "$", decimalDigits: 2, country: "Colombia", flag: "🇨🇴" },
  { code: "CRC", name: "Costa Rican Colón", symbol: "₡", decimalDigits: 2, country: "Costa Rica", flag: "🇨🇷" },
  { code: "CUC", name: "Cuban Convertible Peso", symbol: "CUC$", decimalDigits: 2, country: "Cuba", flag: "🇨🇺" },
  { code: "CUP", name: "Cuban Peso", symbol: "$MN", decimalDigits: 2, country: "Cuba", flag: "🇨🇺" },
  { code: "CVE", name: "Cape Verdean Escudo", symbol: "Esc", decimalDigits: 2, country: "Cape Verde", flag: "🇨🇻" },
  { code: "CZK", name: "Czech Republic Koruna", symbol: "Kč", decimalDigits: 2, country: "Czech Republic", flag: "🇨🇿" },

  // ===== D =====
  { code: "DJF", name: "Djiboutian Franc", symbol: "Fdj", decimalDigits: 0, country: "Djibouti", flag: "🇩🇯" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", decimalDigits: 2, country: "Denmark", flag: "🇩🇰" },
  { code: "DOP", name: "Dominican Peso", symbol: "RD$", decimalDigits: 2, country: "Dominican Republic", flag: "🇩🇴" },
  { code: "DZD", name: "Algerian Dinar", symbol: "DA", decimalDigits: 2, country: "Algeria", flag: "🇩🇿" },

  // ===== E =====
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", decimalDigits: 2, country: "Egypt", flag: "🇪🇬" },
  { code: "ERN", name: "Eritrean Nakfa", symbol: "Nfk", decimalDigits: 2, country: "Eritrea", flag: "🇪🇷" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", decimalDigits: 2, country: "Ethiopia", flag: "🇪🇹" },
  { code: "EUR", name: "Euro", symbol: "€", decimalDigits: 2, country: "European Union", flag: "🇪🇺" },

  // ===== F =====
  { code: "FJD", name: "Fijian Dollar", symbol: "FJ$", decimalDigits: 2, country: "Fiji", flag: "🇫🇯" },
  { code: "FKP", name: "Falkland Islands Pound", symbol: "FK£", decimalDigits: 2, country: "Falkland Islands", flag: "🇫🇰" },

  // ===== G =====
  { code: "GBP", name: "British Pound Sterling", symbol: "£", decimalDigits: 2, country: "United Kingdom", flag: "🇬🇧" },
  { code: "GEL", name: "Georgian Lari", symbol: "ლ", decimalDigits: 2, country: "Georgia", flag: "🇬🇪" },
  { code: "GGP", name: "Guernsey Pound", symbol: "£", decimalDigits: 2, country: "Guernsey", flag: "🇬🇬" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", decimalDigits: 2, country: "Ghana", flag: "🇬🇭" },
  { code: "GIP", name: "Gibraltar Pound", symbol: "£", decimalDigits: 2, country: "Gibraltar", flag: "🇬🇮" },
  { code: "GMD", name: "Gambian Dalasi", symbol: "D", decimalDigits: 2, country: "Gambia", flag: "🇬🇲" },
  { code: "GNF", name: "Guinean Franc", symbol: "FG", decimalDigits: 0, country: "Guinea", flag: "🇬🇳" },
  { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q", decimalDigits: 2, country: "Guatemala", flag: "🇬🇹" },
  { code: "GYD", name: "Guyanaese Dollar", symbol: "G$", decimalDigits: 2, country: "Guyana", flag: "🇬🇾" },

  // ===== H =====
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", decimalDigits: 2, country: "Hong Kong", flag: "🇭🇰" },
  { code: "HNL", name: "Honduran Lempira", symbol: "L", decimalDigits: 2, country: "Honduras", flag: "🇭🇳" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn", decimalDigits: 2, country: "Croatia", flag: "🇭🇷" },
  { code: "HTG", name: "Haitian Gourde", symbol: "G", decimalDigits: 2, country: "Haiti", flag: "🇭🇹" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", decimalDigits: 0, country: "Hungary", flag: "🇭🇺" },

  // ===== I =====
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", decimalDigits: 0, country: "Indonesia", flag: "🇮🇩" },
  { code: "ILS", name: "Israeli New Sheqel", symbol: "₪", decimalDigits: 2, country: "Israel", flag: "🇮🇱" },
  { code: "IMP", name: "Manx pound", symbol: "£", decimalDigits: 2, country: "Isle of Man", flag: "🇮🇲" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", decimalDigits: 2, country: "India", flag: "🇮🇳" },
  { code: "IQD", name: "Iraqi Dinar", symbol: "ع.د", decimalDigits: 3, country: "Iraq", flag: "🇮🇶" },
  { code: "IRR", name: "Iranian Rial", symbol: "﷼", decimalDigits: 2, country: "Iran", flag: "🇮🇷" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr", decimalDigits: 0, country: "Iceland", flag: "🇮🇸" },

  // ===== J =====
  { code: "JEP", name: "Jersey Pound", symbol: "£", decimalDigits: 2, country: "Jersey", flag: "🇯🇪" },
  { code: "JMD", name: "Jamaican Dollar", symbol: "J$", decimalDigits: 2, country: "Jamaica", flag: "🇯🇲" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "JD", decimalDigits: 3, country: "Jordan", flag: "🇯🇴" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", decimalDigits: 0, country: "Japan", flag: "🇯🇵" },

  // ===== K =====
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", decimalDigits: 2, country: "Kenya", flag: "🇰🇪" },
  { code: "KGS", name: "Kyrgystani Som", symbol: "с", decimalDigits: 2, country: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "KHR", name: "Cambodian Riel", symbol: "៛", decimalDigits: 2, country: "Cambodia", flag: "🇰🇭" },
  { code: "KMF", name: "Comorian Franc", symbol: "CF", decimalDigits: 0, country: "Comoros", flag: "🇰🇲" },
  { code: "KPW", name: "North Korean Won", symbol: "₩", decimalDigits: 2, country: "North Korea", flag: "🇰🇵" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", decimalDigits: 0, country: "South Korea", flag: "🇰🇷" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "KD", decimalDigits: 3, country: "Kuwait", flag: "🇰🇼" },
  { code: "KYD", name: "Cayman Islands Dollar", symbol: "CI$", decimalDigits: 2, country: "Cayman Islands", flag: "🇰🇾" },
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸", decimalDigits: 2, country: "Kazakhstan", flag: "🇰🇿" },

  // ===== L =====
  { code: "LAK", name: "Laotian Kip", symbol: "₭", decimalDigits: 2, country: "Laos", flag: "🇱🇦" },
  { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل", decimalDigits: 2, country: "Lebanon", flag: "🇱🇧" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", decimalDigits: 2, country: "Sri Lanka", flag: "🇱🇰" },
  { code: "LRD", name: "Liberian Dollar", symbol: "L$", decimalDigits: 2, country: "Liberia", flag: "🇱🇷" },
  { code: "LSL", name: "Lesotho Loti", symbol: "L", decimalDigits: 2, country: "Lesotho", flag: "🇱🇸" },
  { code: "LYD", name: "Libyan Dinar", symbol: "LD", decimalDigits: 3, country: "Libya", flag: "🇱🇾" },

  // ===== M =====
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", decimalDigits: 2, country: "Morocco", flag: "🇲🇦" },
  { code: "MDL", name: "Moldovan Leu", symbol: "L", decimalDigits: 2, country: "Moldova", flag: "🇲🇩" },
  { code: "MGA", name: "Malagasy Ariary", symbol: "Ar", decimalDigits: 2, country: "Madagascar", flag: "🇲🇬" },
  { code: "MKD", name: "Macedonian Denar", symbol: "ден", decimalDigits: 2, country: "North Macedonia", flag: "🇲🇰" },
  { code: "MMK", name: "Myanma Kyat", symbol: "K", decimalDigits: 2, country: "Myanmar", flag: "🇲🇲" },
  { code: "MNT", name: "Mongolian Tugrik", symbol: "₮", decimalDigits: 2, country: "Mongolia", flag: "🇲🇳" },
  { code: "MOP", name: "Macanese Pataca", symbol: "MOP$", decimalDigits: 2, country: "Macau", flag: "🇲🇴" },
  { code: "MRU", name: "Mauritanian Ouguiya", symbol: "UM", decimalDigits: 2, country: "Mauritania", flag: "🇲🇷" },
  { code: "MUR", name: "Mauritian Rupee", symbol: "₨", decimalDigits: 2, country: "Mauritius", flag: "🇲🇺" },
  { code: "MVR", name: "Maldivian Rufiyaa", symbol: "Rf", decimalDigits: 2, country: "Maldives", flag: "🇲🇻" },
  { code: "MWK", name: "Malawian Kwacha", symbol: "MK", decimalDigits: 2, country: "Malawi", flag: "🇲🇼" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", decimalDigits: 2, country: "Mexico", flag: "🇲🇽" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", decimalDigits: 2, country: "Malaysia", flag: "🇲🇾" },
  { code: "MZN", name: "Mozambican Metical", symbol: "MT", decimalDigits: 2, country: "Mozambique", flag: "🇲🇿" },

  // ===== N =====
  { code: "NAD", name: "Namibian Dollar", symbol: "N$", decimalDigits: 2, country: "Namibia", flag: "🇳🇦" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", decimalDigits: 2, country: "Nigeria", flag: "🇳🇬" },
  { code: "NIO", name: "Nicaraguan Córdoba", symbol: "C$", decimalDigits: 2, country: "Nicaragua", flag: "🇳🇮" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", decimalDigits: 2, country: "Norway", flag: "🇳🇴" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨", decimalDigits: 2, country: "Nepal", flag: "🇳🇵" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", decimalDigits: 2, country: "New Zealand", flag: "🇳🇿" },

  // ===== O =====
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", decimalDigits: 3, country: "Oman", flag: "🇴🇲" },

  // ===== P =====
  { code: "PAB", name: "Panamanian Balboa", symbol: "B/.", decimalDigits: 2, country: "Panama", flag: "🇵🇦" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/.", decimalDigits: 2, country: "Peru", flag: "🇵🇪" },
  { code: "PGK", name: "Papua New Guinean Kina", symbol: "K", decimalDigits: 2, country: "Papua New Guinea", flag: "🇵🇬" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", decimalDigits: 2, country: "Philippines", flag: "🇵🇭" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", decimalDigits: 2, country: "Pakistan", flag: "🇵🇰" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", decimalDigits: 2, country: "Poland", flag: "🇵🇱" },
  { code: "PYG", name: "Paraguayan Guarani", symbol: "₲", decimalDigits: 0, country: "Paraguay", flag: "🇵🇾" },

  // ===== Q =====
  { code: "QAR", name: "Qatari Rial", symbol: "ر.ق", decimalDigits: 2, country: "Qatar", flag: "🇶🇦" },

  // ===== R =====
  { code: "RON", name: "Romanian Leu", symbol: "lei", decimalDigits: 2, country: "Romania", flag: "🇷🇴" },
  { code: "RSD", name: "Serbian Dinar", symbol: "дин.", decimalDigits: 2, country: "Serbia", flag: "🇷🇸" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", decimalDigits: 2, country: "Russia", flag: "🇷🇺" },
  { code: "RWF", name: "Rwandan Franc", symbol: "FRw", decimalDigits: 0, country: "Rwanda", flag: "🇷🇼" },

  // ===== S =====
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", decimalDigits: 2, country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "SBD", name: "Solomon Islands Dollar", symbol: "SI$", decimalDigits: 2, country: "Solomon Islands", flag: "🇸🇧" },
  { code: "SCR", name: "Seychellois Rupee", symbol: "SRe", decimalDigits: 2, country: "Seychelles", flag: "🇸🇨" },
  { code: "SDG", name: "Sudanese Pound", symbol: "ج.س.", decimalDigits: 2, country: "Sudan", flag: "🇸🇩" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", decimalDigits: 2, country: "Sweden", flag: "🇸🇪" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", decimalDigits: 2, country: "Singapore", flag: "🇸🇬" },
  { code: "SHP", name: "Saint Helena Pound", symbol: "£", decimalDigits: 2, country: "Saint Helena", flag: "🇸🇭" },
  { code: "SLE", name: "Sierra Leonean Leone", symbol: "Le", decimalDigits: 2, country: "Sierra Leone", flag: "🇸🇱" },
  { code: "SOS", name: "Somali Shilling", symbol: "Sh", decimalDigits: 2, country: "Somalia", flag: "🇸🇴" },
  { code: "SRD", name: "Surinamese Dollar", symbol: "$", decimalDigits: 2, country: "Suriname", flag: "🇸🇷" },
  { code: "SSP", name: "South Sudanese Pound", symbol: "£", decimalDigits: 2, country: "South Sudan", flag: "🇸🇸" },
  { code: "STN", name: "São Tomé and Príncipe Dobra", symbol: "Db", decimalDigits: 2, country: "São Tomé and Príncipe", flag: "🇸🇹" },
  { code: "SVC", name: "Salvadoran Colón", symbol: "₡", decimalDigits: 2, country: "El Salvador", flag: "🇸🇻" },
  { code: "SYP", name: "Syrian Pound", symbol: "£S", decimalDigits: 2, country: "Syria", flag: "🇸🇾" },
  { code: "SZL", name: "Swazi Lilangeni", symbol: "L", decimalDigits: 2, country: "Eswatini", flag: "🇸🇿" },

  // ===== T =====
  { code: "THB", name: "Thai Baht", symbol: "฿", decimalDigits: 2, country: "Thailand", flag: "🇹🇭" },
  { code: "TJS", name: "Tajikistani Somoni", symbol: "ЅМ", decimalDigits: 2, country: "Tajikistan", flag: "🇹🇯" },
  { code: "TMT", name: "Turkmenistani Manat", symbol: "m", decimalDigits: 2, country: "Turkmenistan", flag: "🇹🇲" },
  { code: "TND", name: "Tunisian Dinar", symbol: "DT", decimalDigits: 3, country: "Tunisia", flag: "🇹🇳" },
  { code: "TOP", name: "Tongan Pa'anga", symbol: "T$", decimalDigits: 2, country: "Tonga", flag: "🇹🇴" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", decimalDigits: 2, country: "Turkey", flag: "🇹🇷" },
  { code: "TTD", name: "Trinidad and Tobago Dollar", symbol: "TT$", decimalDigits: 2, country: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$", decimalDigits: 2, country: "Taiwan", flag: "🇹🇼" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", decimalDigits: 2, country: "Tanzania", flag: "🇹🇿" },

  // ===== U =====
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", decimalDigits: 2, country: "Ukraine", flag: "🇺🇦" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", decimalDigits: 0, country: "Uganda", flag: "🇺🇬" },
  { code: "USD", name: "United States Dollar", symbol: "$", decimalDigits: 2, country: "United States", flag: "🇺🇸" },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$U", decimalDigits: 2, country: "Uruguay", flag: "🇺🇾" },
  { code: "UZS", name: "Uzbekistan Som", symbol: "so'm", decimalDigits: 2, country: "Uzbekistan", flag: "🇺🇿" },

  // ===== V =====
  { code: "VES", name: "Venezuelan Bolívar", symbol: "Bs.", decimalDigits: 2, country: "Venezuela", flag: "🇻🇪" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", decimalDigits: 0, country: "Vietnam", flag: "🇻🇳" },
  { code: "VUV", name: "Vanuatu Vatu", symbol: "VT", decimalDigits: 0, country: "Vanuatu", flag: "🇻🇺" },

  // ===== W =====
  { code: "WST", name: "Samoan Tala", symbol: "WS$", decimalDigits: 2, country: "Samoa", flag: "🇼🇸" },

  // ===== X =====
  { code: "XAF", name: "CFA Franc BEAC", symbol: "FCFA", decimalDigits: 0, country: "Central Africa", flag: "🌍" },
  { code: "XCD", name: "East Caribbean Dollar", symbol: "EC$", decimalDigits: 2, country: "Eastern Caribbean", flag: "🏝️" },
  { code: "XDR", name: "Special Drawing Rights", symbol: "XDR", decimalDigits: 0, country: "IMF", flag: "🌐" },
  { code: "XOF", name: "CFA Franc BCEAO", symbol: "CFA", decimalDigits: 0, country: "West Africa", flag: "🌍" },
  { code: "XPF", name: "CFP Franc", symbol: "₣", decimalDigits: 0, country: "French Pacific", flag: "🏝️" },

  // ===== Y =====
  { code: "YER", name: "Yemeni Rial", symbol: "﷼", decimalDigits: 2, country: "Yemen", flag: "🇾🇪" },

  // ===== Z =====
  { code: "ZAR", name: "South African Rand", symbol: "R", decimalDigits: 2, country: "South Africa", flag: "🇿🇦" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK", decimalDigits: 2, country: "Zambia", flag: "🇿🇲" },
  { code: "ZWL", name: "Zimbabwean Dollar", symbol: "Z$", decimalDigits: 2, country: "Zimbabwe", flag: "🇿🇼" },
];

// Popular currencies (shown in quick select)
export const popularCurrencies = [
  "USD", "EUR", "GBP", "CNY", "JPY", "AED", "INR", "AUD",
  "CAD", "CHF", "SGD", "HKD", "SAR", "KRW", "MXN", "BRL"
];

// Regional groupings
export const regionalCurrencies: Record<string, string[]> = {
  "Americas": ["USD", "CAD", "MXN", "BRL", "ARS", "CLP", "COP", "PEN", "VES", "UYU"],
  "Europe": ["EUR", "GBP", "CHF", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "UAH", "TRY", "RUB"],
  "Asia-Pacific": ["CNY", "JPY", "KRW", "AUD", "NZD", "SGD", "HKD", "TWD", "THB", "IDR", "MYR", "PHP", "VND", "INR", "PKR", "BDT"],
  "Middle East & Africa": ["AED", "SAR", "QAR", "KWD", "BHD", "OMR", "ILS", "EGP", "ZAR", "NGN", "KES", "GHS", "MAD", "DZD"],
  "South Asia": ["INR", "PKR", "BDT", "LKR", "NPR"],
};

export function getCurrencyByCode(code: string): Currency | undefined {
  return currencies.find(c => c.code === code);
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) return `${amount.toFixed(2)} ${currencyCode}`;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currency.decimalDigits,
    maximumFractionDigits: currency.decimalDigits,
  }).format(amount);
}
