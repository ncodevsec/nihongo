// N4 grammar notes. Each rule ("point") has:
//   id         "[lesson]-[rule]"; also the name of its description file md/<id>.md
//   title      short rule name / topic (shown as the heading)
//   structure  the sentence pattern the rule builds. " + " separates parts
//              (rendered as chips); a new line starts another pattern.
//   particles  grammar-element tags (see grammar-elements.js) for grouping
//   examples   [{ jp, meaningBn, note? }] — hiragana/katakana only (no kanji)
// The long description is Markdown, kept in md/<id>.md (see md/README.md).

export const GRAMMAR_N4 = [
  {
    "lesson": 26,
    "title": "Lesson 26",
    "points": [
      {
        "id": "26-1",
        "title": "んです — Explaining Reasons",
        "structure": "Plain Form + んです / んですか",
        "particles": [
          "plain-form",
          "ndesu"
        ],
        "examples": [
          {
            "jp": "あめがふっているんですか।",
            "meaningBn": "বৃষ্টি হচ্ছে?",
            "note": "নিজে ভেজা ছাতা হাতে থাকা মানুষ দেখে"
          },
          {
            "jp": "おもしろいデザインのくつですね。どこでかったんですか。",
            "meaningBn": "কোথায় কিনেছেন?",
            "note": null
          },
          {
            "jp": "どうしておくれたんですか。バスがこなかったんです。",
            "meaningBn": "কেন দেরি হল - বাস আসেনি",
            "note": null
          }
        ]
      },
      {
        "id": "26-2",
        "title": "〜ていただけませんか — Polite Request",
        "structure": "Verb て-Form + いただけませんか",
        "particles": [
          "dake",
          "te-form"
        ],
        "examples": [
          {
            "jp": "せんせいをしょうかいしていただけませんか。",
            "meaningBn": null,
            "note": null
          }
        ]
      },
      {
        "id": "26-3",
        "title": "〜たらいいですか — Asking Advice",
        "structure": "Question Word + Verb た-Form + らいいですか",
        "particles": [
          "ta-form"
        ],
        "examples": [
          {
            "jp": "どこでカメラをかったらいいですか。",
            "meaningBn": null,
            "note": null
          }
        ]
      },
      {
        "id": "26-4",
        "title": "すき・きらい・じょうず・へた",
        "structure": "Noun + は + すきです / きらいです / じょうずです / へたです",
        "particles": [
          "wa",
          "e"
        ],
        "examples": []
      }
    ]
  },
  {
    "lesson": 27,
    "title": "Lesson 27",
    "points": [
      {
        "id": "27-1",
        "title": "Potential Verbs — Formation",
        "structure": "Verb (ます-stem) → Potential Form",
        "particles": [
          "potential"
        ],
        "examples": []
      },
      {
        "id": "27-2",
        "title": "Potential Verb Sentences",
        "structure": "Noun + が + Potential Verb",
        "particles": [
          "potential"
        ],
        "examples": [
          {
            "jp": "わたしはにほんごをはなします → わたしはにほんごがはなせます。",
            "meaningBn": "আমি জাপানি ভাষা বলতে পারি",
            "note": null
          },
          {
            "jp": "いちにんでびょういんへいけますか。",
            "meaningBn": "একা হাসপাতালে যেতে পারবেন?",
            "note": null
          },
          {
            "jp": "たなかさんにあえませんでした。",
            "meaningBn": "তানাকা সানের সাথে দেখা করতে পারিনি",
            "note": null
          },
          {
            "jp": "ミラーさんはかんじがよめます。",
            "meaningBn": "মিরা কাঞ্জি পড়তে পারেন",
            "note": null
          },
          {
            "jp": "このぎんこうでドルがかえられます。",
            "meaningBn": "এই ব্যাংকে ডলার পরিবর্তন করা যায়",
            "note": null
          }
        ]
      },
      {
        "id": "27-3",
        "title": "みえます・きこえます",
        "structure": "Noun + が + みえます / きこえます",
        "particles": [
          "volitional"
        ],
        "examples": [
          {
            "jp": "しんかんせんからふじさんがみえます。",
            "meaningBn": "শিনকানসেন থেকে ফুজি পর্বত দেখা যায়",
            "note": null
          },
          {
            "jp": "ラジオのおとがきこえます。",
            "meaningBn": "রেডিওর শব্দ শোনা যায়",
            "note": null
          },
          {
            "jp": "しんじゅくでいま、くろさわのえいががみられます。",
            "meaningBn": "শিনজুকুতে এখন কুরোসাওয়ার সিনেমা দেখা যায় - এখানে potential verb みられます ব্যবহৃত, ইচ্ছাকৃতভাবে দেখা বোঝাতে",
            "note": null
          },
          {
            "jp": "でんわでてんきよほうがきけます。",
            "meaningBn": "ফোনে আবহাওয়ার পূর্বাভাস শোনা যায়",
            "note": null
          }
        ]
      },
      {
        "id": "27-4",
        "title": "できます — \"Be Made / Completed\"",
        "structure": "Noun + が + できます",
        "particles": [
          "de",
          "dekimasu"
        ],
        "examples": [
          {
            "jp": "えきのまえにおおきいスーパーができました。",
            "meaningBn": "স্টেশনের সামনে একটি বড় সুপার তৈরি হয়েছে",
            "note": null
          },
          {
            "jp": "とけいのしゅうりはいつできますか。",
            "meaningBn": "ঘড়ির মেরামত কবে শেষ হবে?",
            "note": null
          }
        ]
      },
      {
        "id": "27-5",
        "title": "しか — \"Only\" (Negative)",
        "structure": "Noun / Quantity + しか + Negative Verb",
        "particles": [
          "shika"
        ],
        "examples": [
          {
            "jp": "ろーまじしかかけません。",
            "meaningBn": "শুধু রোমান হরফ লিখতে পারি",
            "note": null
          },
          {
            "jp": "ろーまじだけかけます",
            "meaningBn": "তুলনার জন্য, \"শুধু\" অর্থে だけ ইতিবাচক বাক্যে",
            "note": null
          }
        ]
      },
      {
        "id": "27-6",
        "title": "は — Contrast",
        "structure": "Noun + は + Verb ます、 Noun + は + Verb ません",
        "particles": [
          "wa"
        ],
        "examples": [
          {
            "jp": "ワインはのみますが、ビールはのみません。",
            "meaningBn": "ওয়াইন পান করি কিন্তু বিয়ার পান করি না",
            "note": null
          }
        ]
      },
      {
        "id": "27-7",
        "title": "は — Emphasis on a Particle",
        "structure": "Noun + Particle + は",
        "particles": [
          "wa"
        ],
        "examples": [
          {
            "jp": "にっぽんではうまをみることができません。",
            "meaningBn": "জাপানে ঘোড়া দেখা যায় না",
            "note": null
          },
          {
            "jp": "てんきのいいひにはうみがみえるんです。",
            "meaningBn": "আবহাওয়া ভালো দিনে সমুদ্র দেখা যায়",
            "note": null
          },
          {
            "jp": "ここからはとうきょうスカイツリーがみえません。",
            "meaningBn": "এখান থেকে টোকিও স্কাইট্রি দেখা যায় না",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 28,
    "title": "Lesson 28",
    "points": [
      {
        "id": "28-1",
        "title": "ながら — \"While Doing\"",
        "structure": "Verb₁ (ます-stem) + ながら + Verb₂",
        "particles": [
          "nagara",
          "masu-form"
        ],
        "examples": [
          {
            "jp": "おんがくをききながらしょくじします。",
            "meaningBn": "গান শুনতে শুনতে খাবার খাই",
            "note": null
          },
          {
            "jp": "はたらきながらにほんごをべんきょうしています。",
            "meaningBn": "কাজ করার পাশাপাশি জাপানি ভাষা শিখছি",
            "note": null
          }
        ]
      },
      {
        "id": "28-2",
        "title": "〜ています — Habitual Action",
        "structure": "Verb て-Form + います",
        "particles": [
          "te-form"
        ],
        "examples": [
          {
            "jp": "まいあさジョギングをしています。",
            "meaningBn": "প্রতিদিন সকালে জগিং করি",
            "note": null
          },
          {
            "jp": "こどものとき、まいばん8じにねていました。",
            "meaningBn": "ছোটবেলায় প্রতি রাতে ৮টায় ঘুমাতাম",
            "note": null
          }
        ]
      },
      {
        "id": "28-3",
        "title": "し — Listing Reasons",
        "structure": "Plain Form + し、 Plain Form + し、 …",
        "particles": [
          "plain-form"
        ],
        "examples": [
          {
            "jp": "すずきさんはピアノもはじけるし、うたもうたえるし、ダンスもできます。",
            "meaningBn": "সুজুকি সান পিয়ানো বাজাতে পারেন, গান গাইতে পারেন, নাচও পারেন",
            "note": null
          },
          {
            "jp": "たなかさんはまじめだし、ちゅうごくごもじょうずだし、けいけんもあります。",
            "meaningBn": "তানাকা সান সিরিয়াস, চাইনিজও ভালো জানেন, অভিজ্ঞতাও আছে",
            "note": null
          }
        ]
      },
      {
        "id": "28-4",
        "title": "それで — \"So / That's Why\"",
        "structure": "Sentence₁。 それで + Sentence₂",
        "particles": [
          "sorede"
        ],
        "examples": [
          {
            "jp": "しょうらい、しょうせつかになりたいです。それでいまはアルバイトをしながらしょうせつをかいています。",
            "meaningBn": "ভবিষ্যতে ঔপন্যাসিক হতে চাই, তাই এখন পার্ট-টাইম কাজের পাশাপাশি উপন্যাস লিখছি",
            "note": null
          },
          {
            "jp": "ここはコーヒーもおいしいし、しょくじもできるし……。それでにんきがあるんですね。",
            "meaningBn": "এখানে কফিও ভালো, খাবারও পাওয়া যায়... তাই জনপ্রিয়",
            "note": null
          }
        ]
      },
      {
        "id": "28-5",
        "title": "〜とき + Particle",
        "structure": "〜とき + Particle",
        "particles": [
          "toki"
        ],
        "examples": [
          {
            "jp": "べんきょうするときは、おんがくをききません。",
            "meaningBn": "পড়ার সময় গান শুনি না",
            "note": null
          },
          {
            "jp": "つかれたときやさびしいとき、よくいなかのあおいそらをおもいだす。",
            "meaningBn": "ক্লান্ত বা একাকী বোধ করলে প্রায়ই গ্রামের নীল আকাশের কথা মনে পড়ে",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 29,
    "title": "Lesson 29",
    "points": [
      {
        "id": "29-1",
        "title": "〜ています — Resulting State",
        "structure": "Intransitive Verb て-Form + います",
        "particles": [
          "te-form"
        ],
        "examples": [
          {
            "jp": "まどがわれています。",
            "meaningBn": "জানালাটি ভেঙে আছে",
            "note": null
          },
          {
            "jp": "てんきがついています。",
            "meaningBn": "বাতি জ্বলছে",
            "note": null
          },
          {
            "jp": "このいすはこわれています。",
            "meaningBn": "এই চেয়ারটি ভাঙা আছে",
            "note": null
          }
        ]
      },
      {
        "id": "29-2",
        "title": "〜てしまいました — Completion & Regret",
        "structure": "Verb て-Form + しまいました",
        "particles": [
          "te-form",
          "te-shimau"
        ],
        "examples": [
          {
            "jp": "ジョミットさんがもってきたワインはみんなでのんでしまいました。",
            "meaningBn": "জোমিট সান নিয়ে আসা ওয়াইন সবাই মিলে খেয়ে ফেলেছি",
            "note": null
          },
          {
            "jp": "かんじのしゅくだいはもうやってしまいました。",
            "meaningBn": "কাঞ্জির বাড়ির কাজ আগেই করে ফেলেছি",
            "note": null
          },
          {
            "jp": "ひるごはんまでにレポートをかいてしまいます。",
            "meaningBn": "দুপুরের খাবারের আগেই রিপোর্ট লিখে ফেলব",
            "note": null
          },
          {
            "jp": "パスポートをなくしてしまいました。",
            "meaningBn": "পাসপোর্ট হারিয়ে ফেলেছি",
            "note": null
          },
          {
            "jp": "パソコンがこしょうしてしまいました。",
            "meaningBn": "কম্পিউটার নষ্ট হয়ে গেছে",
            "note": null
          }
        ]
      },
      {
        "id": "29-3",
        "title": "に — Direction with Motion Verbs",
        "structure": "Noun (Place) + に + いきます / きます / かえります",
        "particles": [
          "ni"
        ],
        "examples": [
          {
            "jp": "どこかでさいふをおとしてしまったんです。",
            "meaningBn": "কোথাও মানিব্যাগ ফেলে দিয়েছি",
            "note": null
          },
          {
            "jp": "それはたいへんですね。すぐこうばんにいかないと。",
            "meaningBn": "এটা তো খুবই খারাপ। দ্রুত পুলিশ বক্সে যেতে হবে",
            "note": null
          }
        ]
      },
      {
        "id": "29-4",
        "title": "それ・その・そう — Referring Back",
        "structure": "それ / その / そう + …",
        "particles": [
          "kore-sore-are"
        ],
        "examples": [
          {
            "jp": "どこかでさいふをおとしてしまったんです。それはたいへんですね。すぐこうばんにいかないと。",
            "meaningBn": "কোথাও মানিব্যাগ ফেলে দিয়েছি। — সেটা তো খুবই খারাপ",
            "note": null
          },
          {
            "jp": "らいげつからおおさかのほんしゃにてんきんなんです。それはおめでとうございます。",
            "meaningBn": "আগামী মাস থেকে ওসাকা হেড অফিসে বদলি হচ্ছি। — সেটা তো অভিনন্দনের বিষয়!",
            "note": null
          },
          {
            "jp": "あのう、みちでやめずめたばあいは?……そのばあいは、ちかくのかかりいんになまえをいって、かえってください。",
            "meaningBn": "রাস্তায় হারিয়ে গেলে? — সেক্ষেত্রে কাছের কর্মীকে নাম বলে ফিরে যান",
            "note": null
          },
          {
            "jp": "うちへかえって、やすんだほうがいいですよ。……ええ、そうします。",
            "meaningBn": "বাসায় গিয়ে বিশ্রাম নেওয়া ভালো। — হ্যাঁ তাই করব",
            "note": null
          },
          {
            "jp": "いちにんでコンサートやてんらんかいにでかけると、いいでしょう。そのとき、とちゅうのひとがしょうらいのこいびとになるかもしれません。",
            "meaningBn": "একা কনসার্ট বা প্রদর্শনীতে গেলে, সেই সময় পথের মানুষটি ভবিষ্যতের প্রেমিক/প্রেমিকা হতে পারে",
            "note": null
          }
        ]
      },
      {
        "id": "29-5",
        "title": "ありました — \"Found It\"",
        "structure": "Noun + が + ありました",
        "particles": [
          "arimasu-past"
        ],
        "examples": [
          {
            "jp": "[かばんが]ありましたよ。",
            "meaningBn": "ব্যাগটা পাওয়া গেছে!",
            "note": null
          },
          {
            "jp": "さがしていたしりょうがほんだなにありました。",
            "meaningBn": null,
            "note": null
          }
        ]
      },
      {
        "id": "29-6",
        "title": "どこかで・どこかに — \"Somewhere\"",
        "structure": "どこか + で / に",
        "particles": [
          "doko"
        ],
        "examples": [
          {
            "jp": "どこかでさいふをなくしてしまいました。",
            "meaningBn": "কোথাও মানিব্যাগ হারিয়ে ফেলেছি",
            "note": null
          },
          {
            "jp": "どこかにでんわがあります。",
            "meaningBn": "এখানে কোথাও টেলিফোন আছে",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 30,
    "title": "Lesson 30",
    "points": [
      {
        "id": "30-1",
        "title": "〜てあります — State by Intention",
        "structure": "Noun₁ + に + Noun₂ + が + Transitive Verb て-Form + あります",
        "particles": [
          "te-form"
        ],
        "examples": [
          {
            "jp": "カレンダーにこんげつのよていがかいてあります。",
            "meaningBn": "ক্যালেন্ডারে এই মাসের প্ল্যান লেখা আছে",
            "note": null
          },
          {
            "jp": "メモはどこですか。……[メモは]つくえのうえにおいてあります。",
            "meaningBn": "মেমো কোথায়? — টেবিলের উপর রাখা আছে",
            "note": null
          },
          {
            "jp": "こんげつのよていはかべのカレンダーにかいてあります。",
            "meaningBn": "এই মাসের প্ল্যান দেয়ালের ক্যালেন্ডারে লেখা আছে",
            "note": null
          }
        ]
      },
      {
        "id": "30-2",
        "title": "〜ておきます — Preparing in Advance",
        "structure": "Verb て-Form + おきます",
        "particles": [
          "te-form",
          "te-oku"
        ],
        "examples": [
          {
            "jp": "りょこうのまえに、きっぷをかっておきます。",
            "meaningBn": "ভ্রমণের আগে টিকিট কিনে রাখব",
            "note": null
          },
          {
            "jp": "つぎのかいぎまでになにをしておいたらいいですか。",
            "meaningBn": "পরের মিটিং পর্যন্ত কী প্রস্তুত করে রাখা ভালো?",
            "note": null
          },
          {
            "jp": "このしりょうをよんでおいてください。",
            "meaningBn": "এই তথ্যগুলো আগে পড়ে রাখুন",
            "note": null
          },
          {
            "jp": "はさみをつかったら、もとのところにもどしておいてください。",
            "meaningBn": "কাঁচি ব্যবহার শেষে যথাস্থানে রেখে দিন",
            "note": null
          },
          {
            "jp": "あしたかいぎがありますから、いすはこのままにしておいてください。",
            "meaningBn": "আগামীকাল মিটিং আছে, তাই চেয়ারগুলো এভাবেই রেখে দিন",
            "note": null
          },
          {
            "jp": "そこにおいといて[おいておいて]ください。",
            "meaningBn": "দেখুন lesson 38",
            "note": null
          }
        ]
      },
      {
        "id": "30-3",
        "title": "まだ + Affirmative — \"Still\"",
        "structure": "まだ + Affirmative Verb",
        "particles": [
          "affirmative"
        ],
        "examples": [
          {
            "jp": "まだあめがふっています。",
            "meaningBn": "এখনও বৃষ্টি হচ্ছে",
            "note": null
          },
          {
            "jp": "どうぐをかたづけましょうか。……まだつかっていますから、そのままにしておいてください。",
            "meaningBn": "সরঞ্জাম গুছিয়ে রাখব? — এখনও ব্যবহার করছি, ওভাবেই থাকতে দিন",
            "note": null
          }
        ]
      },
      {
        "id": "30-4",
        "title": "とか — \"Such As\"",
        "structure": "Noun + とか + Noun + とか",
        "particles": [
          "toka"
        ],
        "examples": [
          {
            "jp": "どんなスポーツをしていますか。……そうですね、テニスとかすいえいとか……。",
            "meaningBn": "কী ধরনের খেলা করেন? — টেনিস বা সাঁতার ইত্যাদি",
            "note": null
          }
        ]
      },
      {
        "id": "30-5",
        "title": "Particle + も — Emphasis",
        "structure": "Particle + も",
        "particles": [
          "mo"
        ],
        "examples": [
          {
            "jp": "ほかにもいろいろあります。",
            "meaningBn": "আরও অনেক কিছু আছে",
            "note": null
          },
          {
            "jp": "どこ[へ]もいきません。",
            "meaningBn": "আমি কোথাও যাচ্ছি না",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 31,
    "title": "Lesson 31",
    "points": [
      {
        "id": "31-1",
        "title": "Volitional Form — Formation",
        "structure": "Verb (ます-stem) → Volitional Form",
        "particles": [
          "volitional"
        ],
        "examples": []
      },
      {
        "id": "31-2",
        "title": "Volitional Form — Uses",
        "structure": "Volitional Form + とおもっています",
        "particles": [
          "volitional"
        ],
        "examples": [
          {
            "jp": "ちょっとやすまない? …うん、やすもう。",
            "meaningBn": "একটু বিশ্রাম নেবে না? — হ্যাঁ, বিশ্রাম নেওয়া যাক",
            "note": null
          },
          {
            "jp": "てつだおうか。",
            "meaningBn": "আমি সাহায্য করতে পারি কি?",
            "note": null
          },
          {
            "jp": "かさをもっていこうか。",
            "meaningBn": "আমরা কি ছাতা নেব? — Volitional form এর পরে か বসিয়ে \"shall we?\" জিজ্ঞাসা",
            "note": null
          },
          {
            "jp": "しゅうまつはうみへいこうとおもっています。",
            "meaningBn": "সপ্তাহান্তে সমুদ্রে যাওয়ার পরিকল্পনা করছি",
            "note": null
          },
          {
            "jp": "いまからぎんこうへいこうとおもいます。",
            "meaningBn": "এখন থেকে ব্যাংকে যাওয়ার কথা ভাবছি",
            "note": null
          },
          {
            "jp": "かれはがっこうをつくろうとおもっています。",
            "meaningBn": "সে স্কুল তৈরি করার কথা ভাবছে",
            "note": null
          }
        ]
      },
      {
        "id": "31-3",
        "title": "つもりです — Intention",
        "structure": "Verb Dictionary / ない-Form + つもりです",
        "particles": [
          "nai-form",
          "plain-form",
          "tsumori"
        ],
        "examples": [
          {
            "jp": "くにへかえっても、にほんごのべんきょうをつづけるつもりです。",
            "meaningBn": "দেশে ফিরে গেলেও জাপানি ভাষা চর্চা চালিয়ে যাওয়ার ইচ্ছা আছে",
            "note": null
          },
          {
            "jp": "あしたからはたばこをすわないつもりです。",
            "meaningBn": "আগামীকাল থেকে ধূমপান না করার পরিকল্পনা",
            "note": null
          }
        ]
      },
      {
        "id": "31-4",
        "title": "よていです — Plans",
        "structure": "Verb Dictionary / Noun + の + よていです",
        "particles": [
          "no",
          "plain-form",
          "yotei"
        ],
        "examples": [
          {
            "jp": "7つきのおわりにドイツへしゅっちょうするよていです。",
            "meaningBn": "জুলাই শেষে জার্মানিতে ব্যবসায়িক ভ্রমণের পরিকল্পনা আছে",
            "note": null
          },
          {
            "jp": "りょこうは1しゅうかんぐらいのよていです。",
            "meaningBn": "ভ্রমণ প্রায় এক সপ্তাহের পরিকল্পনা আছে",
            "note": null
          }
        ]
      },
      {
        "id": "31-5",
        "title": "まだ〜ていません — \"Not Yet\"",
        "structure": "まだ + Verb て-Form + いません",
        "particles": [
          "te-form"
        ],
        "examples": [
          {
            "jp": "ぎんこうはまだひらいていません。",
            "meaningBn": "ব্যাংক এখনও খোলেনি",
            "note": null
          },
          {
            "jp": "レポートはもうかきましたか。……いいえ、まだかいていません。",
            "meaningBn": "রিপোর্ট কি লেখা হয়েছে? — না, এখনও লেখা হয়নি",
            "note": null
          }
        ]
      },
      {
        "id": "31-6",
        "title": "Verb (ます-stem) as a Noun",
        "structure": "Verb (ます-stem) → Noun",
        "particles": [
          "kaerimasu-koso"
        ],
        "examples": [
          {
            "jp": "かえりのしんかんせんはどこからのりますか。",
            "meaningBn": "ফেরার শিনকানসেন কোথা থেকে ধরব?",
            "note": null
          },
          {
            "jp": "やすみはなにようびですか。",
            "meaningBn": "ছুটির দিন কোনটি?",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 32,
    "title": "Lesson 32",
    "points": [
      {
        "id": "32-1",
        "title": "ほうがいいです — Advice",
        "structure": "Verb た-Form / ない-Form + ほうがいいです",
        "particles": [
          "ta-form",
          "nai-form",
          "hougaii"
        ],
        "examples": [
          {
            "jp": "まいにちうんどうしたほうがいいです。",
            "meaningBn": "প্রতিদিন ব্যায়াম করা ভালো",
            "note": null
          },
          {
            "jp": "ねつがあるんです。……じゃ、おふろにはいらないほうがいいです。",
            "meaningBn": "জ্বর আছে। — তাহলে গোসল না করাই ভালো",
            "note": null
          },
          {
            "jp": "にっぽんのおてらがみたいんですが……。……じゃ、きょうとへいったらいいですよ。",
            "meaningBn": "জাপানের মন্দির দেখতে চাই... — তাহলে কিয়োটো যাওয়া ভালো",
            "note": null
          }
        ]
      },
      {
        "id": "32-2",
        "title": "でしょう — Probability",
        "structure": "Plain Form + でしょう",
        "particles": [
          "plain-form",
          "deshou"
        ],
        "examples": [
          {
            "jp": "あしたはあめがふるでしょう。",
            "meaningBn": "আগামীকাল বৃষ্টি হতে পারে",
            "note": null
          },
          {
            "jp": "タワポンさんはごうかくするでしょうか。……きっとごうかくするでしょう。",
            "meaningBn": "তাওয়াপন কি পাস করবে? — নিশ্চয়ই পাস করবে",
            "note": null
          }
        ]
      },
      {
        "id": "32-3",
        "title": "かもしれません — \"Might\"",
        "structure": "Plain Form + かもしれません",
        "particles": [
          "plain-form",
          "moshi-tara"
        ],
        "examples": [
          {
            "jp": "やくそくのじかんにまにあわないかもしれません。",
            "meaningBn": "প্রতিশ্রুত সময়ে পৌঁছাতে না-ও পারি",
            "note": null
          }
        ]
      },
      {
        "id": "32-4",
        "title": "〜ましょう — \"Let Me …\"",
        "structure": "Verb (ます-stem) + ましょう",
        "particles": [
          "masu-form",
          "volitional"
        ],
        "examples": [
          {
            "jp": "エンジンのおとがおかしいんですが。……そうですね。こしょうかもしれません。ちょっとしらべましょう。",
            "meaningBn": "ইঞ্জিনের শব্দ অস্বাভাবিক লাগছে — তাই তো, ত্রুটি হতে পারে, একটু দেখি",
            "note": null
          }
        ]
      },
      {
        "id": "32-5",
        "title": "Quantifier + で — \"Within / For\"",
        "structure": "Quantifier + で",
        "particles": [
          "de"
        ],
        "examples": [
          {
            "jp": "えきまで30ふんでいけますか。",
            "meaningBn": "স্টেশন পর্যন্ত ৩০ মিনিটে যাওয়া যাবে?",
            "note": null
          },
          {
            "jp": "3まんえんでパソコンがかえますか。",
            "meaningBn": "৩০,০০০ ইয়েনে একটি কম্পিউটার পাওয়া যাবে?",
            "note": null
          }
        ]
      },
      {
        "id": "32-6",
        "title": "なにか・どこか — \"Something / Somewhere\"",
        "structure": "なにか + Adjective + こと",
        "particles": [
          "nani"
        ],
        "examples": [
          {
            "jp": "なにかしんぱいなことがあるんですか。",
            "meaningBn": "কোনো চিন্তার বিষয় আছে?",
            "note": null
          },
          {
            "jp": "スキーにいきたいんですが、どこかいいところ、ありますか。",
            "meaningBn": "স্কি করতে যেতে চাই, কোথাও ভালো জায়গা আছে?",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 33,
    "title": "Lesson 33",
    "points": [
      {
        "id": "33-1",
        "title": "Imperative & Prohibitive — Formation",
        "structure": "Verb → Imperative\nVerb Dictionary + な",
        "particles": [
          "imperative"
        ],
        "examples": []
      },
      {
        "id": "33-2",
        "title": "Imperative — Uses",
        "structure": "Verb Imperative / Verb Dictionary + な",
        "particles": [
          "imperative"
        ],
        "examples": [
          {
            "jp": "はやくねろ。",
            "meaningBn": "তাড়াতাড়ি ঘুমাও",
            "note": null
          },
          {
            "jp": "おくれるな。",
            "meaningBn": "দেরি করো না",
            "note": null
          },
          {
            "jp": "にげろ。",
            "meaningBn": "পালাও",
            "note": null
          },
          {
            "jp": "エレベーターをつかうな。",
            "meaningBn": "লিফট ব্যবহার করো না",
            "note": null
          },
          {
            "jp": "やすめ。",
            "meaningBn": "বিশ্রাম নাও",
            "note": null
          },
          {
            "jp": "あわてるな。",
            "meaningBn": "তাড়াহুড়ো করো না",
            "note": null
          },
          {
            "jp": "がんばれ。",
            "meaningBn": "চালিয়ে যাও",
            "note": null
          },
          {
            "jp": "まけるな。",
            "meaningBn": "হারবে না",
            "note": null
          },
          {
            "jp": "とまれ。",
            "meaningBn": "থামো",
            "note": null
          },
          {
            "jp": "はいるな。",
            "meaningBn": "প্রবেশ নিষেধ",
            "note": null
          },
          {
            "jp": "べんきょうしなさい。",
            "meaningBn": "পড়াশোনা করো",
            "note": null
          }
        ]
      },
      {
        "id": "33-3",
        "title": "〜とかいてあります・よみます",
        "structure": "Noun + と + かいてあります / よみます",
        "particles": [
          "toka"
        ],
        "examples": [
          {
            "jp": "あのかんじはなんとよむんですか。",
            "meaningBn": "ঐ কাঞ্জি কীভাবে পড়া হয়?",
            "note": null
          },
          {
            "jp": "あそこに[とまれ]とかいてあります。",
            "meaningBn": "ওখানে \"থামো\" লেখা আছে",
            "note": null
          }
        ]
      },
      {
        "id": "33-4",
        "title": "〜という いみです — Meaning",
        "structure": "X + は + Y + という いみです",
        "particles": [
          "wa"
        ],
        "examples": [
          {
            "jp": "[たちいりきんし]はどういういみですか。",
            "meaningBn": "たちいりきんし এর অর্থ কী?",
            "note": null
          },
          {
            "jp": "このマークはどういういみですか。……たちいりきんしといういみです。",
            "meaningBn": "এই চিহ্নের অর্থ কী? — প্রবেশ নিষেধ অর্থ",
            "note": null
          }
        ]
      },
      {
        "id": "33-5",
        "title": "〜といっていました — Reported Speech",
        "structure": "Plain Form + と + いっていました",
        "particles": [
          "plain-form"
        ],
        "examples": [
          {
            "jp": "たなかさんは[あしたやすみます]といっていました。",
            "meaningBn": "তানাকা সান বলেছিলেন আগামীকাল ছুটি নেবেন",
            "note": null
          }
        ]
      },
      {
        "id": "33-6",
        "title": "〜とつたえていただけませんか — Passing a Message",
        "structure": "Plain Form + と + つたえていただけませんか",
        "particles": [
          "dake",
          "plain-form"
        ],
        "examples": [
          {
            "jp": "ワンさんに[あとででんわをください]とつたえていただけませんか。",
            "meaningBn": "ওয়াং সানকে বলবেন যে পরে ফোন করতে?",
            "note": null
          },
          {
            "jp": "すみませんが、わたなべさんにあしたのパーティーは6じからだとつたえていただけませんか。",
            "meaningBn": "দুঃখিত, ওয়াতানাবে সানকে বলবেন আগামীকালের পার্টি ৬টা থেকে?",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 34,
    "title": "Lesson 34",
    "points": [
      {
        "id": "34-1",
        "title": "とおりに — \"As / Just Like\"",
        "structure": "Verb た-Form / Noun + の + とおりに + Verb",
        "particles": [
          "no",
          "ta-form"
        ],
        "examples": [
          {
            "jp": "わたしがやったとおりに、やってください。",
            "meaningBn": "আমি যেভাবে করেছি সেভাবেই করুন",
            "note": null
          },
          {
            "jp": "みたとおりに、はなしてください。",
            "meaningBn": "আপনি যা দেখেছিলেন ঠিক তা বলুন",
            "note": null
          },
          {
            "jp": "せんのとおりに、かみをきってください。",
            "meaningBn": "লাইন অনুযায়ী কাগজ কেটে দিন",
            "note": null
          },
          {
            "jp": "せつめいしょのとおりに、くみたてました。",
            "meaningBn": "নির্দেশনা অনুসারে একত্রিত করেছিলাম",
            "note": null
          },
          {
            "jp": "このとおりにかいてください。",
            "meaningBn": "এভাবেই লিখুন",
            "note": null
          }
        ]
      },
      {
        "id": "34-2",
        "title": "あとで — \"After\"",
        "structure": "Verb た-Form / Noun + の + あとで + Verb",
        "particles": [
          "no",
          "ta-form"
        ],
        "examples": [
          {
            "jp": "あたらしいのをかったあとで、なくしたとけいがみつかりました。",
            "meaningBn": "নতুনটা কেনার পরে হারানো ঘড়িটা পাওয়া গেল",
            "note": null
          },
          {
            "jp": "しごとのあとで、のみにいきますか。",
            "meaningBn": "কাজের পরে পান করতে যাবেন?",
            "note": null
          }
        ]
      },
      {
        "id": "34-3",
        "title": "〜ないで — \"Without Doing\"",
        "structure": "Verb て-Form / ない-Form + ないで + Verb",
        "particles": [
          "nai-form"
        ],
        "examples": [
          {
            "jp": "しょうゆをつけてたべます。",
            "meaningBn": "সয়া সস মাখিয়ে খাই",
            "note": null
          },
          {
            "jp": "しょうゆをつけないでたべます。",
            "meaningBn": "সয়া সস না মাখিয়ে খাই",
            "note": null
          },
          {
            "jp": "にちようびはどこもいかないで、うちでゆっくりやすみます。",
            "meaningBn": "রবিবার কোথাও না গিয়ে বাড়িতে আরামে বিশ্রাম নেব",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 35,
    "title": "Lesson 35",
    "points": [
      {
        "id": "35-1",
        "title": "Conditional ば — Formation",
        "structure": "Verb / Adj / Noun → ば-Form",
        "particles": [
          "conditional-ba"
        ],
        "examples": []
      },
      {
        "id": "35-2",
        "title": "ば — Conditional Usage",
        "structure": "ば-Form + Result",
        "particles": [
          "conditional-ba"
        ],
        "examples": [
          {
            "jp": "ボタンをおせば、まどがひらきます。",
            "meaningBn": "বোতাম চাপলে জানালা খুলবে",
            "note": null
          },
          {
            "jp": "かれがいけば、わたしもいきます。",
            "meaningBn": "সে গেলে আমিও যাব",
            "note": null
          },
          {
            "jp": "あしたつごうがよければ、きてください。",
            "meaningBn": "আগামীকাল সুবিধাজনক হলে আসুন",
            "note": null
          },
          {
            "jp": "いいてんきなら、むこうにしまがみえます。",
            "meaningBn": "আবহাওয়া ভালো হলে ওপাশে দ্বীপ দেখা যায়",
            "note": null
          },
          {
            "jp": "ボールペンがないんですが……。……ボールペンがなければ、えんぴつでかいてください。",
            "meaningBn": "বলপয়েন্ট নেই... — না থাকলে পেন্সিল দিয়ে লিখুন",
            "note": null
          },
          {
            "jp": "あしたまでにレポートをださなければなりませんか。……むりなら、きんようびまでにだしてください。",
            "meaningBn": "কাল পর্যন্ত রিপোর্ট জমা দিতেই হবে? — না পারলে শুক্রবার পর্যন্ত দিন",
            "note": null
          },
          {
            "jp": "ここをおすと、ドアがひらきます。(এখানে চাপলে দরজা খোলে) — 〜ばও একই অর্থে ব্যবহার হয়: ここをおせば、ドアがひらきます。",
            "meaningBn": null,
            "note": null
          },
          {
            "jp": "とうきょうへきたら、ぜひれんらくしてください。",
            "meaningBn": "টোকিও এলে অবশ্যই যোগাযোগ করবেন",
            "note": null
          },
          {
            "jp": "たなかさんがくれば、[わたしは]あいにいきます。",
            "meaningBn": "তানাকা সান এলে আমি দেখা করতে যাব",
            "note": null
          }
        ]
      },
      {
        "id": "35-3",
        "title": "どうすればいいですか — Asking What To Do",
        "structure": "Question Word + Verb ば-Form + いいですか",
        "particles": [
          "conditional-ba"
        ],
        "examples": [
          {
            "jp": "ほんをかりたいんですが、どうすればいいですか。",
            "meaningBn": "বই ধার নিতে চাই, কী করলে ভালো হবে?",
            "note": null
          }
        ]
      },
      {
        "id": "35-4",
        "title": "なら — \"If It's About …\"",
        "structure": "Noun + なら、 …",
        "particles": [
          "nara"
        ],
        "examples": [
          {
            "jp": "おんせんにいきたいんですが、どこがいいですか。……おんせんなら、はくばがいいですよ。",
            "meaningBn": "উষ্ণ প্রস্রবণে যেতে চাই, কোথায় ভালো হবে? — উষ্ণ প্রস্রবণ হলে হাকুবা ভালো",
            "note": null
          }
        ]
      },
      {
        "id": "35-5",
        "title": "〜はありませんか — Polite Inquiry",
        "structure": "Noun + は + ありませんか",
        "particles": [
          "negative-question"
        ],
        "examples": [
          {
            "jp": "2、3にちりょこうをしようとおもっているんですが、どこかいいところはありませんか。",
            "meaningBn": "২-৩ দিনের জন্য ভ্রমণ করতে চাচ্ছি, কোথাও ভালো জায়গা নেই?",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 36,
    "title": "Lesson 36",
    "points": [
      {
        "id": "36-1",
        "title": "ように — \"In Order To\"",
        "structure": "Verb Dictionary / ない-Form + ように + Verb",
        "particles": [
          "youni",
          "nai-form",
          "plain-form",
          "you-desu"
        ],
        "examples": [
          {
            "jp": "はやくおよげるように、まいにちれんしゅうしています。",
            "meaningBn": "তাড়াতাড়ি সাঁতার শিখতে প্রতিদিন অনুশীলন করছি",
            "note": null
          },
          {
            "jp": "わすれないように、メモしてください。",
            "meaningBn": "ভুলে না যাওয়ার জন্য মেমো করুন",
            "note": null
          }
        ]
      },
      {
        "id": "36-2",
        "title": "ようになります — \"Come To Be Able\"",
        "structure": "Verb Dictionary / ない-Form + ようになります",
        "particles": [
          "nai-form",
          "plain-form",
          "narimasu"
        ],
        "examples": [
          {
            "jp": "まいにちれんしゅうすれば、およげるようになります。",
            "meaningBn": "প্রতিদিন অনুশীলন করলে আপনি সাঁতার শিখতে পারবেন",
            "note": null
          },
          {
            "jp": "やっとじてんしゃにのれるようになりました。",
            "meaningBn": "অবশেষে সাইকেল চালাতে সক্ষম হয়েছি",
            "note": null
          },
          {
            "jp": "ショパンのきょくがひけるようになりましたか。……いいえ、まだひけません。",
            "meaningBn": "শোপানের গান বাজাতে পারেন? — না, এখনও পারি না",
            "note": null
          },
          {
            "jp": "にっぽんは100ねんぐらいまれから、ぎゅうにくやぶたにくをたべるようになりました。",
            "meaningBn": "জাপানে ১০০ বছর আগে থেকে গরু ও শুয়োরের মাংস খাওয়া শুরু হয়েছে",
            "note": null
          }
        ]
      },
      {
        "id": "36-3",
        "title": "ようにします — \"Try To\"",
        "structure": "Verb Dictionary / ない-Form + ようにします / してください",
        "particles": [
          "youni",
          "nai-form",
          "plain-form",
          "you-desu"
        ],
        "examples": [
          {
            "jp": "まいにちうんどうして、なにでもたべるようにしています。",
            "meaningBn": "প্রতিদিন ব্যায়াম করি এবং সব কিছু খাওয়ার চেষ্টা করি",
            "note": null
          },
          {
            "jp": "はにわるいいですから、あまいものをたべないようにしています。",
            "meaningBn": "দাঁতের জন্য খারাপ তাই মিষ্টি জিনিস না খাওয়ার চেষ্টা করি",
            "note": null
          },
          {
            "jp": "もっとやさいをたべるようにしてください。",
            "meaningBn": "আরও সবজি খাওয়ার চেষ্টা করুন",
            "note": null
          },
          {
            "jp": "ぜったいにパスポートをなくさないようにしてください。",
            "meaningBn": "অবশ্যই পাসপোর্ট হারাবেন না, সে ব্যাপারে সতর্ক থাকুন",
            "note": null
          }
        ]
      },
      {
        "id": "36-4",
        "title": "Adjective → Adverb",
        "structure": "い-Adj (〜い → 〜く) / な-Adj (〜な → 〜に)",
        "particles": [
          "adj-adverbial"
        ],
        "examples": [
          {
            "jp": "はやくじょうずにおちゃがたてられるようになりたいです。",
            "meaningBn": "তাড়াতাড়ি ও দক্ষভাবে চা বানাতে সক্ষম হতে চাই",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 37,
    "title": "Lesson 37",
    "points": [
      {
        "id": "37-1",
        "title": "Passive Verbs — Formation",
        "structure": "Verb (ます-stem) → Passive Form",
        "particles": [
          "passive"
        ],
        "examples": []
      },
      {
        "id": "37-2",
        "title": "Passive — Being Acted Upon",
        "structure": "Noun₁ + は + Noun₂ + に + Passive Verb",
        "particles": [
          "wa",
          "ni",
          "passive"
        ],
        "examples": [
          {
            "jp": "せんせいはわたしをほめました。(শিক্ষক আমাকে প্রশংসা করেছিলেন) → わたしはせんせいにほめられました。",
            "meaningBn": "আমি শিক্ষক দ্বারা প্রশংসিত হয়েছি",
            "note": null
          },
          {
            "jp": "ははがわたしにかいものをたのみました。→わたしはははにかいものをたのまれました。",
            "meaningBn": "আমাকে মা কেনাকাটা করতে বলেছিলেন",
            "note": null
          },
          {
            "jp": "わたしはいぬにかまれました。",
            "meaningBn": "আমি কুকুরের দ্বারা কামড়ানো হয়েছিলাম",
            "note": null
          }
        ]
      },
      {
        "id": "37-3",
        "title": "Passive — Suffering",
        "structure": "Noun₁ + は + Noun₂ + に + Noun₃ + を + Passive Verb",
        "particles": [
          "wa",
          "wo",
          "ni",
          "passive"
        ],
        "examples": [
          {
            "jp": "おとうとがわたしのパソコンをこわしました。→わたしはおとうとにパソコンをこわされました。",
            "meaningBn": "আমার ছোট ভাই দ্বারা আমার পিসি ভাঙা হয়েছিল",
            "note": null
          },
          {
            "jp": "わたしはいぬにてをかまれました。",
            "meaningBn": "আমার হাত কুকুরের দ্বারা কামড়ানো হয়েছিল",
            "note": null
          },
          {
            "jp": "わたしはともだちにじてんしゃをしゅうりしてもらいました。",
            "meaningBn": "আমার বন্ধু আমার সাইকেলটি মেরামত করেছিল",
            "note": null
          }
        ]
      },
      {
        "id": "37-4",
        "title": "Passive — Things & Events",
        "structure": "Noun + が / は + Passive Verb",
        "particles": [
          "wa",
          "ga",
          "passive"
        ],
        "examples": [
          {
            "jp": "おおさかでてんらんかいがひらかれました。",
            "meaningBn": "ওসাকায় প্রদর্শনী অনুষ্ঠিত হয়েছিল",
            "note": null
          },
          {
            "jp": "でんわは19せいきにはつめいされました。",
            "meaningBn": "টেলিফোন ১৯ শতকে উদ্ভাবিত হয়েছিল",
            "note": null
          },
          {
            "jp": "このほんはせかいじゅうでよまれています。",
            "meaningBn": "এই বইটি সারা বিশ্বে পঠিত হয়",
            "note": null
          }
        ]
      },
      {
        "id": "37-5",
        "title": "から・で つくります — \"Made From / Of\"",
        "structure": "Noun + から / で + つくります",
        "particles": [
          "de",
          "kara"
        ],
        "examples": [
          {
            "jp": "ビールはむぎからつくられます。",
            "meaningBn": "বিয়ার বার্লি থেকে তৈরি হয়",
            "note": null
          },
          {
            "jp": "むかし、にっぽんのいえはきでつくられました。",
            "meaningBn": "আগে জাপানের বাড়ি কাঠ দিয়ে তৈরি হতো",
            "note": null
          }
        ]
      },
      {
        "id": "37-6",
        "title": "の — Noun Link",
        "structure": "Noun₁ + の + Noun₂",
        "particles": [
          "no"
        ],
        "examples": [
          {
            "jp": "ビールはむぎからつくられます。これがげんりょうのむぎです。",
            "meaningBn": "এটাই কাঁচামাল বার্লি",
            "note": null
          }
        ]
      },
      {
        "id": "37-7",
        "title": "この・その・あの + Position Noun",
        "structure": "この / その / あの + Position Noun",
        "particles": [
          "kono-sono-ano"
        ],
        "examples": [
          {
            "jp": "あのなかにいれますか。",
            "meaningBn": "আপনি কি ভেতরে দেখতে পারেন?",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 38,
    "title": "Lesson 38",
    "points": [
      {
        "id": "38-1",
        "title": "の — Nominalizer",
        "structure": "Verb Plain Form + の",
        "particles": [
          "no"
        ],
        "examples": []
      },
      {
        "id": "38-2",
        "title": "のは〜です — Topic",
        "structure": "Verb Dictionary + のは + Adjective + です",
        "particles": [
          "no",
          "plain-form"
        ],
        "examples": [
          {
            "jp": "テニスはおもしろいです。(টেনিস মজার) → テニスをするのはおもしろいです。(টেনিস খেলা মজার) → テニスをみるのはおもしろいです。",
            "meaningBn": "টেনিস দেখা মজার",
            "note": null
          }
        ]
      },
      {
        "id": "38-3",
        "title": "のが〜です — Preference & Skill",
        "structure": "Verb Dictionary + のが + Adjective + です",
        "particles": [
          "no",
          "plain-form"
        ],
        "examples": [
          {
            "jp": "わたしははながすきです。",
            "meaningBn": "আমি ফুল পছন্দ করি",
            "note": null
          },
          {
            "jp": "わたしははなをそだてるのがすきです。",
            "meaningBn": "আমি ফুল চাষ পছন্দ করি",
            "note": null
          },
          {
            "jp": "とうきょうのひとはあるくのがはやいです。",
            "meaningBn": "টোকিওর লোকেরা দ্রুত হাটে",
            "note": null
          }
        ]
      },
      {
        "id": "38-4",
        "title": "のをわすれました — \"Forgot To\"",
        "structure": "Verb Dictionary + のを + わすれました",
        "particles": [
          "no",
          "plain-form"
        ],
        "examples": [
          {
            "jp": "かぎをわすれました。",
            "meaningBn": "চাবি ভুলে গেছি",
            "note": null
          },
          {
            "jp": "ぎゅうにゅうをかうのをわすれました。",
            "meaningBn": "দুধ কিনতে ভুলে গেছি",
            "note": null
          },
          {
            "jp": "くるまのまどをしめるのをわすれました。",
            "meaningBn": "গাড়ির জানালা বন্ধ করতে ভুলে গেছি",
            "note": null
          }
        ]
      },
      {
        "id": "38-5",
        "title": "のをしっていますか — \"Do You Know That…?\"",
        "structure": "Verb Plain Form + のを + しっていますか",
        "particles": [
          "no",
          "plain-form",
          "teimasu"
        ],
        "examples": [
          {
            "jp": "すずきさんがらいげつけっこんするのをしっていますか。",
            "meaningBn": "আপনি কি জানেন সুজুকি সান পরের মাসে বিয়ে করবেন?",
            "note": null
          },
          {
            "jp": "きむらさんにあかちゃんがうまれたのをしっていますか。……いいえ、しりませんでした。",
            "meaningBn": "কিমুরা সানের বাচ্চা হয়েছে জানেন? — না, জানতাম না",
            "note": null
          },
          {
            "jp": "ミラーさんのじゅうしょをしっていますか。……いいえ、しりません。",
            "meaningBn": "মিলার সানের ঠিকানা জানেন? — না জানি না",
            "note": null
          }
        ]
      },
      {
        "id": "38-6",
        "title": "のは — Emphasis (Cleft)",
        "structure": "Plain Form + のは + Noun + です",
        "particles": [
          "no",
          "plain-form"
        ],
        "examples": [
          {
            "jp": "はじめてあったのはいつですか。……3ねんまえです。",
            "meaningBn": "প্রথম দেখা হয়েছিল কবে? — ৩ বছর আগে",
            "note": null
          },
          {
            "jp": "バンコクでうまれたんですか。……いいえ、うまれたのはチェンマイです。",
            "meaningBn": "ব্যাংককে জন্ম হয়েছিল? — না, চিয়াংমাইতে জন্ম হয়েছিল",
            "note": null
          },
          {
            "jp": "ちちがうまれたのはほっかいどうのちいさなむらです。",
            "meaningBn": "আমার বাবা হোক্কাইদোর ছোট গ্রামে জন্মেছিলেন",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 39,
    "title": "Lesson 39",
    "points": [
      {
        "id": "39-1",
        "title": "て-Form — Reason / Cause",
        "structure": "Verb て-Form / なくて / Adj くて / Noun で + Result",
        "particles": [
          "de",
          "te-form"
        ],
        "examples": [
          {
            "jp": "ニュースをきいて、びっくりしました。",
            "meaningBn": "খবর শুনে অবাক হয়ে গিয়েছিলাম",
            "note": null
          },
          {
            "jp": "かぞくにあえなくて、さびしいです。",
            "meaningBn": "পরিবারের সাথে দেখা করতে না পেরে আমি দুঃখপ্রকাশ করি",
            "note": null
          },
          {
            "jp": "どようびはつごうがわるくて、いけません。",
            "meaningBn": "শনিবার সুবিধাজনক না থাকায় যেতে পারছি না",
            "note": null
          },
          {
            "jp": "はなしがふくざつで、よくわかりませんでした。",
            "meaningBn": "কথাটি জটিল হওয়ায় ভালোভাবে বুঝতে পারিনি",
            "note": null
          },
          {
            "jp": "じこがあって、バスがおくれてしまいました。",
            "meaningBn": "একটি দুর্ঘটনার কারণে বাসটি দেরিতে এসেছিল",
            "note": null
          },
          {
            "jp": "じゅぎょうにおくれて、せんせいにしかられました。",
            "meaningBn": "ক্লাসে দেরি করার জন্য শিক্ষক আমাকে বকা দিয়েছিলেন",
            "note": null
          },
          {
            "jp": "あぶないですから、きかいにさわらないでください。(বিপজ্জনক তাই মেশিন স্পর্শ করবেন না) — X あぶなくて、きかいにさわらないでください।",
            "meaningBn": "ভুল",
            "note": null
          },
          {
            "jp": "じしんでビルがたおれました。",
            "meaningBn": "ভূমিকম্পের কারণে ভবন ভেঙে পড়েছিল",
            "note": null
          },
          {
            "jp": "びょうきでかいしゃをやすみました。",
            "meaningBn": "অসুস্থতার কারণে অফিস থেকে ছুটি নিয়েছিলাম",
            "note": null
          }
        ]
      },
      {
        "id": "39-2",
        "title": "ので — \"Because\"",
        "structure": "Plain Form (だ → な) + ので",
        "particles": [
          "node",
          "plain-form"
        ],
        "examples": [
          {
            "jp": "にほんごがわからないので、えいごではなしていただけませんか。",
            "meaningBn": "জাপানি ভাষা বুঝি না, তাই আপনি কি ইংরেজিতে কথা বলবেন?",
            "note": null
          },
          {
            "jp": "ようじがあるので、おさきにしつれいします。",
            "meaningBn": "কাজ থাকার কারণে আমি আগে যাচ্ছি",
            "note": null
          }
        ]
      },
      {
        "id": "39-3",
        "title": "とちゅうで — \"On the Way\"",
        "structure": "Verb Dictionary / Noun + の + とちゅうで",
        "particles": [
          "en-route"
        ],
        "examples": [
          {
            "jp": "じつはくるとちゅうでじこがあって、バスがおくれてしまったんです。",
            "meaningBn": "আসলে, আসার সময় একটি দুর্ঘটনা ঘটেছিল তাই বাস দেরি করেছিল",
            "note": null
          },
          {
            "jp": "マラソンのとちゅうできぶんがわるくなりました。",
            "meaningBn": "ম্যারাথনের সময় অসুস্থ বোধ করছিলাম",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 40,
    "title": "Lesson 40",
    "points": [
      {
        "id": "40-1",
        "title": "か — Embedded Question",
        "structure": "Question Word + Plain Form + か",
        "particles": [
          "plain-form",
          "ka"
        ],
        "examples": [
          {
            "jp": "JL107びんはなんじにとうちゃくするか、しらべてください。",
            "meaningBn": "JL107 ফ্লাইটটি কখন আসবে তা দয়াকরে দেখেনিন",
            "note": null
          },
          {
            "jp": "けっこんのおいわいはなにがいいか、はなしています。",
            "meaningBn": "বিবাহের উপহার হিসেবে কি ভালো হবে তা নিয়ে আমরা কথা বলেছি",
            "note": null
          },
          {
            "jp": "わたしたちがはじめてあったのはいつか、おぼえていますか。",
            "meaningBn": "আপনার কি মনে আছে কখন আমাদের প্রথম দেখা হয়েছিল?",
            "note": null
          }
        ]
      },
      {
        "id": "40-2",
        "title": "かどうか — \"Whether or Not\"",
        "structure": "Plain Form + かどうか",
        "particles": [
          "plain-form"
        ],
        "examples": [
          {
            "jp": "ぼうねんかいにしゅっせきするかどうか、20にちまでにへんじをください。",
            "meaningBn": "বছরশেষের পার্টিতে উপস্থিত থাকবেন কিনা তা ২০ তারিখের মধ্যে জানাবেন",
            "note": null
          },
          {
            "jp": "そのはなしはほんとうかどうか、わかりません。",
            "meaningBn": "ওই কথাটি সত্যি কিনা জানি না",
            "note": null
          },
          {
            "jp": "まちがいがないかどうか、しらべてください。",
            "meaningBn": "কোনো ভুল আছে কিনা দেখুন",
            "note": null
          }
        ]
      },
      {
        "id": "40-3",
        "title": "〜てみます — \"Try Doing\"",
        "structure": "Verb て-Form + みます",
        "particles": [
          "te-form"
        ],
        "examples": [
          {
            "jp": "もういちどかんがえてみます。",
            "meaningBn": "আবার একবার চিন্তা করে দেখব",
            "note": null
          },
          {
            "jp": "このズボンをはいてみてもいいですか。",
            "meaningBn": "এই ট্রাউজারটা পরে দেখতে পারি?",
            "note": null
          },
          {
            "jp": "ほっかいどうへいってみたいです。",
            "meaningBn": "হোক্কাইদোতে গিয়ে দেখতে চাই",
            "note": null
          }
        ]
      },
      {
        "id": "40-4",
        "title": "〜さ — Adjective → Noun",
        "structure": "い-Adj (〜い → 〜さ)",
        "particles": [
          "adj-adverbial"
        ],
        "examples": [
          {
            "jp": "やまのたかさはどうやってはかるか、しっていますか。",
            "meaningBn": "পাহাড়ের উচ্চতা কীভাবে মাপা হয় জানেন?",
            "note": null
          },
          {
            "jp": "あたらしいはしのながさは3,911メートルです。",
            "meaningBn": "নতুন সেতুর দৈর্ঘ্য ৩,৯১১ মিটার",
            "note": null
          }
        ]
      },
      {
        "id": "40-5",
        "title": "〜でしょうか — Polite Question",
        "structure": "Question + でしょうか",
        "particles": [
          "deshou"
        ],
        "examples": [
          {
            "jp": "ハンスはがっこうでどうでしょうか。",
            "meaningBn": "হানস স্কুলে কেমন করছে বলে মনে হয়?",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 41,
    "title": "Lesson 41",
    "points": [
      {
        "id": "41-1",
        "title": "Giving & Receiving (Honorific)",
        "structure": "Noun₁ + に + Noun₂ + を + いただきます / くださいます / やります",
        "particles": [
          "ageru-morau-kureru"
        ],
        "examples": [
          {
            "jp": "わたしはしゃちょうにおみやげをいただきました。",
            "meaningBn": "আমি কোম্পানির প্রধান থেকে উপহার পেয়েছিলাম",
            "note": null
          },
          {
            "jp": "しゃちょうがわたしにおみやげをくださいました。",
            "meaningBn": "কোম্পানির প্রধান আমাকে উপহার দিয়েছিলেন",
            "note": null
          },
          {
            "jp": "むすめはぶちょうにおみやげをいただきました。",
            "meaningBn": "আমার কন্যা কোম্পানির প্রধান থেকে উপহার পেয়েছিলেন",
            "note": null
          },
          {
            "jp": "ぶちょうがむすめにおみやげをくださいました。",
            "meaningBn": "কোম্পানির প্রধান আমার কন্যাকে উপহার দিয়েছিলেন",
            "note": null
          },
          {
            "jp": "わたしはむすこにおかしをやりました(あげました)。",
            "meaningBn": "আমি আমার ছেলেকে কিছু মিষ্টি দিয়েছিলাম",
            "note": null
          },
          {
            "jp": "わたしはいぬにえさをやりました。",
            "meaningBn": "আমি কুকুরকে খাবার দিয়েছিলাম",
            "note": null
          }
        ]
      },
      {
        "id": "41-2",
        "title": "Favors (Honorific)",
        "structure": "Verb て-Form + いただきます / くださいます / やります",
        "particles": [
          "ageru-morau-kureru"
        ],
        "examples": [
          {
            "jp": "ぶちょうが[わたしを]えきまでおくってくださいました。",
            "meaningBn": "আমার বিভাগীয় প্রধান স্টেশন পর্যন্ত সেখান থেকে বিদায় দিয়েছিলেন",
            "note": null
          },
          {
            "jp": "ぶちょうが[わたしの]レポートをなおしてくださいました。",
            "meaningBn": "বিভাগীয় প্রধান আমার রিপোর্ট সংশোধন করে দিয়েছিলেন",
            "note": null
          },
          {
            "jp": "わたしはいぬをさんぽにつれていってやりました。",
            "meaningBn": "আমি কুকুরকে হাটার জন্য নিয়ে গিয়েছিলাম",
            "note": null
          },
          {
            "jp": "わたしはむすめのしゅくだいをみてやりました(あげました)。",
            "meaningBn": "আমি আমার মেয়ের বাড়ির কাজ দেখিয়ে দিয়েছিলাম",
            "note": null
          }
        ]
      },
      {
        "id": "41-3",
        "title": "〜てくださいませんか — Polite Request",
        "structure": "Verb て-Form + くださいませんか",
        "particles": [
          "te-form"
        ],
        "examples": [
          {
            "jp": "コピーきのつかいかたをおしえてくださいませんか。",
            "meaningBn": "আপনি আমাকে কি মেশিনটি ব্যবহার করা কে শিখাবে দিবেন?",
            "note": null
          },
          {
            "jp": "コピーきのつかいかたをおしえていただけませんか。",
            "meaningBn": "আপনি আমাকে কি মেশিনটি ব্যবহার করা কে শিখাবে দিবেন? See lesson 26",
            "note": null
          }
        ]
      },
      {
        "id": "41-4",
        "title": "に — \"As / For\"",
        "structure": "Noun + に + Verb",
        "particles": [
          "ni"
        ],
        "examples": [
          {
            "jp": "たなかさんがけっこんいわいにこのおさらをくださいました。",
            "meaningBn": "তানাকা সান বিয়ের উপহার হিসেবে বিয়ানে দিয়েছিলেন",
            "note": null
          },
          {
            "jp": "ほっかいどうりょこうのおみやげににんぎょうをかいました。",
            "meaningBn": "হোক্কাইদো ভ্রমণের সময় উপহার হিসেবে একটি পুতুল কিনেছিলাম",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 42,
    "title": "Lesson 42",
    "points": [
      {
        "id": "42-1",
        "title": "ために — \"In Order To / For\"",
        "structure": "Verb Dictionary / Noun + の + ために",
        "particles": [
          "no",
          "plain-form"
        ],
        "examples": [
          {
            "jp": "じぶんのみせをもつために、ちょきんしています。",
            "meaningBn": "নিজের দোকান দেওয়ার জন্য টাকা জমাচ্ছি",
            "note": null
          },
          {
            "jp": "ひっこしのために、くるまをかります。",
            "meaningBn": "বাসা বদলের জন্য গাড়ি ভাড়া করব",
            "note": null
          },
          {
            "jp": "けんこうのために、まいあさはしっています。",
            "meaningBn": "স্বাস্থ্যের জন্য প্রতি সকালে দৌড়াই",
            "note": null
          },
          {
            "jp": "かぞくのために、うちをたてます。",
            "meaningBn": "পরিবারের জন্য বাড়ি তৈরি করব",
            "note": null
          },
          {
            "jp": "べんごしになるために、ほうりつをべんきょうしています。",
            "meaningBn": "আইনজীবী হওয়ার জন্য আইন পড়াশোনা করছি",
            "note": null
          },
          {
            "jp": "にほんごがじょうずになるように、まいにちべんきょうしています。(জাপানি ভাষায় দক্ষ হওয়ার জন্য প্রতিদিন পড়াশোনা করছি)",
            "meaningBn": "See lesson 36",
            "note": null
          }
        ]
      },
      {
        "id": "42-2",
        "title": "に — Purpose & Use",
        "structure": "Verb Dictionary / Noun + に + つかいます / べんりです",
        "particles": [
          "ni",
          "plain-form"
        ],
        "examples": [
          {
            "jp": "このはさみははなをきるのにつかいます。",
            "meaningBn": "এই কাঁচি ফুল কাটতে ব্যবহার করা হয়",
            "note": null
          },
          {
            "jp": "このかばんはおおきくて、りょこうにべんりです。",
            "meaningBn": "এই ব্যাগটা বড় হওয়ায় ভ্রমণে সুবিধাজনক",
            "note": null
          },
          {
            "jp": "でんわばんごうをしらべるのにじかんがかかりました。",
            "meaningBn": "ফোন নাম্বার খুঁজতে সময় লেগেছিল",
            "note": null
          }
        ]
      },
      {
        "id": "42-3",
        "title": "Quantifier は / も",
        "structure": "Quantifier + は / も",
        "particles": [
          "wa",
          "mo"
        ],
        "examples": [
          {
            "jp": "わたしは[ボーナスの]はんぶんはちょきんするつもりです。",
            "meaningBn": "আমি বোনাসের অর্ধেক জমানোর পরিকল্পনা করছি",
            "note": null
          },
          {
            "jp": "はんぶんもちょきんするんですか。……ええ、はんぶんもちょきんするんです。",
            "meaningBn": "অর্ধেক জমাবেন? — হ্যাঁ, অর্ধেক জমাবো",
            "note": null
          }
        ]
      },
      {
        "id": "42-4",
        "title": "によって — \"By\" (Creator)",
        "structure": "Noun + によって + Passive Verb",
        "particles": [
          "ni",
          "niyotte"
        ],
        "examples": [
          {
            "jp": "チキンラーメンは1958ねんにあんどうひゃくふくさんによってはつめいされました。",
            "meaningBn": "চিকেন রামেন ১৯৫৮ সালে আনডো মোমোফুকু আবিষ্কার করেছিলেন",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 43,
    "title": "Lesson 43",
    "points": [
      {
        "id": "43-1",
        "title": "そうです — \"Looks Like\"",
        "structure": "Verb (ます-stem) / い-Adj / な-Adj + そうです",
        "particles": [
          "sou-desu"
        ],
        "examples": [
          {
            "jp": "いまにもあめがおりそうです。",
            "meaningBn": "মনে হচ্ছে এখনি বৃষ্টি পড়বে",
            "note": null
          },
          {
            "jp": "もうすぐさくらがさきそうです。",
            "meaningBn": "মনে হচ্ছে চেরি ফুল ফুটবে",
            "note": null
          },
          {
            "jp": "これからさむくなりそうです。",
            "meaningBn": "মনে হচ্ছে ঠাণ্ডা নামবে",
            "note": null
          },
          {
            "jp": "このりょうりはしあわせそうです。",
            "meaningBn": "এই খাবারটি সুস্বাদু মনে হচ্ছে",
            "note": null
          },
          {
            "jp": "かのじょはあたまがよさそうです。",
            "meaningBn": "তাকে বুদ্ধিমান মনে হচ্ছে",
            "note": null
          },
          {
            "jp": "このつくえはじょうぶそうです。",
            "meaningBn": "এই টেবিলটি শক্ত মনে হচ্ছে",
            "note": null
          },
          {
            "jp": "うれしそうですね。……ええ、じつはきのうけっこんをもうしこまれたんです。",
            "meaningBn": "খুশি খুশি লাগছে! — হ্যাঁ, আসলে গতকাল বিয়ের প্রস্তাব পেয়েছি",
            "note": null
          }
        ]
      },
      {
        "id": "43-2",
        "title": "〜てきます — \"Do and Come Back\"",
        "structure": "Verb て-Form + きます",
        "particles": [
          "te-form"
        ],
        "examples": [
          {
            "jp": "ちょっとたばこをかったきます。",
            "meaningBn": "একটু সিগারেট কিনতে যাচ্ছি এবং ফিরে আসব",
            "note": null
          },
          {
            "jp": "スーパーでぎゅうにゅうをかってきます。",
            "meaningBn": "সুপার থেকে দুধ কিনে আসব",
            "note": null
          },
          {
            "jp": "だいどころからコップをとってきます。",
            "meaningBn": "রান্নাঘর থেকে গ্লাস নিয়ে আসব",
            "note": null
          },
          {
            "jp": "ゆうびんきょくへいってきます。",
            "meaningBn": "পোস্ট অফিসে যাচ্ছি ও ফিরে আসব",
            "note": null
          },
          {
            "jp": "ちょっとでかけてきます。",
            "meaningBn": "একটু বেরিয়ে আসব",
            "note": null
          }
        ]
      },
      {
        "id": "43-3",
        "title": "〜てくれませんか — Casual Request",
        "structure": "Verb て-Form + くれませんか",
        "particles": [
          "te-form"
        ],
        "examples": [
          {
            "jp": "コンビニへいってきます。……じゃ、おべんとうをかってきてくれませんか。",
            "meaningBn": "সুবিধার দোকানে যাচ্ছি — তাহলে টিফিন কিনে আনবে?",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 44,
    "title": "Lesson 44",
    "points": [
      {
        "id": "44-1",
        "title": "すぎます — \"Too Much\"",
        "structure": "Verb (ます-stem) / い-Adj / な-Adj + すぎます",
        "particles": [
          "masu-form"
        ],
        "examples": [
          {
            "jp": "ゆうべおさけをのみすぎました。",
            "meaningBn": "গতকাল রাতে অতিরিক্ত মদ পান করেছিলাম",
            "note": null
          },
          {
            "jp": "このセーターはおおきすぎます。এই সোয়েটারটি আমার জন্য অনেক বড়।",
            "meaningBn": null,
            "note": null
          },
          {
            "jp": "さいきんのくるまはそうさがかんたんすぎて、うんてんがおもしろくないです。",
            "meaningBn": "আজকালকার গাড়িগুলি চালানো খুব সহজ এবং গাড়ি চালানো আকর্ষণীয় নয়",
            "note": null
          },
          {
            "jp": "いくらすきでも、のみすぎると、からだにわるいですよ。",
            "meaningBn": "যতই পছন্দ করেন না কেন, অতিরিক্ত পান করা আপনার জন্য খারাপ",
            "note": null
          }
        ]
      },
      {
        "id": "44-2",
        "title": "やすい・にくい — \"Easy / Hard To\"",
        "structure": "Verb (ます-stem) + やすいです / にくいです",
        "particles": [
          "masu-form"
        ],
        "examples": [
          {
            "jp": "このパソコンはつかいやすいです。",
            "meaningBn": "এই কম্পিউটারটা PC ব্যবহার করা সহজ",
            "note": null
          },
          {
            "jp": "とうきょうはすみにくいです。",
            "meaningBn": "টোকিওতে বসবাস করা কঠিন",
            "note": null
          },
          {
            "jp": "しろいシャツはよごれやすいです。",
            "meaningBn": "সাদা শার্ট সহজেই ময়লা হয়ে যায়",
            "note": null
          },
          {
            "jp": "あめのひはせんたくぶつがかわきにくいです。",
            "meaningBn": "বৃষ্টির দিনে জামাকাপড় শুকানো কঠিন হয়",
            "note": null
          },
          {
            "jp": "このくすりはさとうをいれると、のみやすくなりますよ。",
            "meaningBn": "এই ওষুধ চিনি মেশালে খাওয়া সহজ হয়ে যাবে",
            "note": null
          },
          {
            "jp": "このコップはわれにくくて、あんぜんですよ。",
            "meaningBn": "এই গ্লাসটি সহজে ভাঙে না, তাই এটি নিরাপদ",
            "note": null
          }
        ]
      },
      {
        "id": "44-3",
        "title": "〜くします・〜にします — \"Make It …\"",
        "structure": "Noun + を + い-Adj (〜く) / な-Adj (〜に) + します",
        "particles": [
          "wo",
          "ni"
        ],
        "examples": [
          {
            "jp": "おとをおおきくします。",
            "meaningBn": "শব্দ বাড়িয়ে দিন",
            "note": null
          },
          {
            "jp": "へやをきれいにします。",
            "meaningBn": "কক্ষ পরিষ্কার করুন",
            "note": null
          },
          {
            "jp": "しおのりょうをはんぶんにしました。",
            "meaningBn": "লবণের মাত্রা অর্ধেক করে রেখেছিলাম",
            "note": null
          }
        ]
      },
      {
        "id": "44-4",
        "title": "Nにします — Choosing",
        "structure": "Noun + に + します",
        "particles": [
          "ni"
        ],
        "examples": [
          {
            "jp": "へやはシングルにしますか、ツインにしますか。",
            "meaningBn": "আপনি কি একজনের নাকি দুইজনের রুম নিবেন?",
            "note": null
          },
          {
            "jp": "かいぎはあしたにします。",
            "meaningBn": "আগামীকাল মিটিং আছে",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 45,
    "title": "Lesson 45",
    "points": [
      {
        "id": "45-1",
        "title": "ばあいは — \"In Case Of\"",
        "structure": "Plain Form / Noun + の + ばあいは",
        "particles": [
          "no",
          "ta-form",
          "nai-form",
          "plain-form"
        ],
        "examples": [
          {
            "jp": "かいぎにまにあわないばあいは、れんらくしてください。",
            "meaningBn": "মিটিংয়ে সময় মত থাকতে না পারলে আমাদের সাথে যোগাযোগ করুন",
            "note": null
          },
          {
            "jp": "じかんにおくれたばあいは、かいじょうにいれません。",
            "meaningBn": "আপনি যদি দেরি করেন তাহলে আপনি অনুষ্ঠান স্থলে ঢুকতে পারবেন না",
            "note": null
          },
          {
            "jp": "パソコンのちょうしがわるいばあいは、どうしたらいいですか。",
            "meaningBn": "যদি PC ঠিক মত কাজ না করে তাহলে আমার কি করা উচিত?",
            "note": null
          },
          {
            "jp": "りょうしゅうしょがひつようなばあいは、いってください。",
            "meaningBn": "যদি আপনার রশিদ প্রয়োজন হয় দয়াকরে আমাকে জানাবেন",
            "note": null
          },
          {
            "jp": "かじやじしんのばあいは、エレベーターをつかわないでください。",
            "meaningBn": "আগুন বা ভূমিকম্পের সময় লিফট ব্যবহার করবেন না",
            "note": null
          }
        ]
      },
      {
        "id": "45-2",
        "title": "のに — \"Although\"",
        "structure": "Plain Form (だ → な) + のに",
        "particles": [
          "noni",
          "plain-form"
        ],
        "examples": [
          {
            "jp": "やくそくをしたのに、かのじょはきませんでした。",
            "meaningBn": "প্রতিশ্রুতি দেওয়া সত্ত্বেও তিনি আসেননি",
            "note": null
          },
          {
            "jp": "きょうはにちようびなのに、はたらかなければなりません。",
            "meaningBn": "আজ রবিবার হলেও কাজ করতে হবে",
            "note": null
          },
          {
            "jp": "やくそくをしましたが、かのじょはきませんでした。",
            "meaningBn": "প্রতিশ্রুতি দিয়েছিলাম কিন্তু তিনি আসেননি",
            "note": null
          },
          {
            "jp": "きょうはにちようびですが、はたらかなければなりません。",
            "meaningBn": "আজ শনিবার কিন্তু কাজ করতে হবে",
            "note": null
          },
          {
            "jp": "あしたあめがふっても、サッカーをします。",
            "meaningBn": "আগামীকাল বৃষ্টি হলেও, ফুটবল খেলব",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 46,
    "title": "Lesson 46",
    "points": [
      {
        "id": "46-1",
        "title": "ところです — Stage of an Action",
        "structure": "Verb Dictionary / て-Form いる / た-Form + ところです",
        "particles": [
          "te-form",
          "ta-form",
          "plain-form",
          "tokoro"
        ],
        "examples": [
          {
            "jp": "ひるごはんはもうたべましたか。……いいえ、これからたべるところです。",
            "meaningBn": "দুপুরের খাবার খেয়েছেন? — না, এখন খাব",
            "note": null
          },
          {
            "jp": "かいぎはもうはじまりましたか。……いいえ、いまからはじまるところです。",
            "meaningBn": "মিটিং কি শুরু হয়েছে? — না এখনই শুরু হবে",
            "note": null
          },
          {
            "jp": "こしょうのげんいんがわかりましたか。……いいえ、いま、しらべているところです。",
            "meaningBn": "ত্রুটির কারণ কি বোঝা গেছে? — না, এখন খতিয়ে দেখছি",
            "note": null
          },
          {
            "jp": "わたなべさんはいますか。……あ、たったいまかえったところです。",
            "meaningBn": "ওয়াতানাবে সান আছেন? — এই মাত্র ফিরে গেছেন",
            "note": null
          },
          {
            "jp": "たったいまバスがでたところです。",
            "meaningBn": "এইমাত্র বাস ছেড়ে গেছে",
            "note": null
          },
          {
            "jp": "もしもしたなかですが、いまいいでしょうか。……すみません。いまからでかけるところなんです……。",
            "meaningBn": "হ্যালো তানাকা, আপনি আমাকে একটু সময় দিতে পারবেন? — দুঃখিত, আমি এখনি বাহির হবো",
            "note": null
          }
        ]
      },
      {
        "id": "46-2",
        "title": "ばかりです — \"Just Did\"",
        "structure": "Verb た-Form + ばかりです",
        "particles": [
          "bakari",
          "ta-form"
        ],
        "examples": [
          {
            "jp": "さっきひるごはんをたべたばかりです。",
            "meaningBn": "এইমাত্র দুপুরের খাবার খেয়েছি",
            "note": null
          },
          {
            "jp": "きむらさんはせんげつこのかいしゃにはいったばかりです。",
            "meaningBn": "কিমুরা সান গত মাসে এই কোম্পানিতে যোগদান করেছেন",
            "note": null
          },
          {
            "jp": "このビデオはせんしゅうかったばかりなのに、ちょうしがおかしいです。",
            "meaningBn": "এই ভিডিওটি গত সপ্তাহে কেনা হলেও ঠিকমতো চলছে না",
            "note": null
          }
        ]
      },
      {
        "id": "46-3",
        "title": "はずです — \"Should Be\"",
        "structure": "Plain Form / Noun + の + はずです",
        "particles": [
          "no",
          "ta-form",
          "nai-form",
          "plain-form",
          "hazu"
        ],
        "examples": [
          {
            "jp": "ミラーさんはきょうくるでしょうか。……くるはずですよ。きのうでんわがありましたから。",
            "meaningBn": "মিলার সান আজ আসবেন কি? — অবশ্যই আসবেন, কারণ গতকাল ফোন করেছিলেন",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 47,
    "title": "Lesson 47",
    "points": [
      {
        "id": "47-1",
        "title": "そうです — Hearsay",
        "structure": "Plain Form + そうです",
        "particles": [
          "plain-form",
          "sou-desu"
        ],
        "examples": [
          {
            "jp": "てんきよほうによると、あしたはさむくなるそうです。",
            "meaningBn": "আবহাওয়ার পূর্বাভাস অনুযায়ী আগামীকাল ঠাণ্ডা হবে",
            "note": null
          },
          {
            "jp": "クララさんはこどものとき、フランスにすんでいたそうです。",
            "meaningBn": "শোনা যায় ক্লারা সান ছোটবেলায় ফ্রান্সে থাকতেন",
            "note": null
          },
          {
            "jp": "パリはとてもきれいだそうです。",
            "meaningBn": "শোনা যায় প্যারিস খুব সুন্দর",
            "note": null
          },
          {
            "jp": "あめがおりそうです。(মনে হচ্ছে বৃষ্টি হবে)",
            "meaningBn": "See Lesson 43",
            "note": null
          },
          {
            "jp": "あめがふるそうです。",
            "meaningBn": "আমি শুনেছি বৃষ্টি হবে",
            "note": null
          },
          {
            "jp": "このりょうりはおいしそうです。",
            "meaningBn": "খাবারটি অনেক সুস্বাদু মনে হচ্ছে",
            "note": null
          },
          {
            "jp": "このりょうりはおいしいそうです。",
            "meaningBn": "তারা বলেছে খাবারটি সুস্বাদু",
            "note": null
          },
          {
            "jp": "ミラーさんはあしたきょうとへいくそうです。",
            "meaningBn": "মিলার আগামীকাল কিয়োটো যাবেন শুনেছি",
            "note": null
          },
          {
            "jp": "ミラーさんはあしたきょうとへいくといっていました。",
            "meaningBn": "মি. মিলার বলেছেন তিনি আগামীকাল কিয়োটো যাবেন",
            "note": null
          }
        ]
      },
      {
        "id": "47-2",
        "title": "ようです — \"It Seems\"",
        "structure": "Plain Form (だ → な / の) + ようです",
        "particles": [
          "no",
          "plain-form",
          "you-desu"
        ],
        "examples": [
          {
            "jp": "ひとがたいせいあつまっていますね。……じこのようですね。パトカーときゅうきゅうしゃがきていますよ。",
            "meaningBn": "অনেক লোক জড়ো হয়েছে! — মনে হচ্ছে দুর্ঘটনা হয়েছে, পুলিশের গাড়ি এবং এম্বুলেন্স এসেছে",
            "note": null
          },
          {
            "jp": "せきもでるし、あたまもいたい。どうもかぜをひいたようだ。",
            "meaningBn": "কাশিও হচ্ছে, মাথাও ব্যথা করছে। মনে হচ্ছে ঠাণ্ডা লেগেছে",
            "note": null
          },
          {
            "jp": "ミラーさんはいそがしそうです。",
            "meaningBn": "মিলারকে ব্যস্ত দেখাচ্ছে",
            "note": null
          },
          {
            "jp": "ミラーさんはいそがしいようです。",
            "meaningBn": "মিলার ব্যস্ত মনে হচ্ছে",
            "note": null
          }
        ]
      },
      {
        "id": "47-3",
        "title": "こえ・おと・におい・あじ + します — Senses",
        "structure": "Noun + が + します",
        "particles": [
          "ni",
          "smell-sound"
        ],
        "examples": [
          {
            "jp": "にぎやかなこえがしますね。",
            "meaningBn": "কি সুন্দর কণ্ঠস্বর, তাই না?",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 48,
    "title": "Lesson 48",
    "points": [
      {
        "id": "48-1",
        "title": "Causative Verbs — Formation",
        "structure": "Verb (ます-stem) → Causative Form",
        "particles": [
          "causative"
        ],
        "examples": []
      },
      {
        "id": "48-2",
        "title": "Causative Sentences",
        "structure": "Noun (Person) + を / に + Causative Verb",
        "particles": [
          "causative"
        ],
        "examples": [
          {
            "jp": "ぶちょうはミラーさんをアメリカへしゅっちょうさせます。",
            "meaningBn": "বিভাগীয় প্রধান মি. মিলারকে আমেরিকায় ব্যবসায়িক কাজে যেতে বলেছেন",
            "note": null
          },
          {
            "jp": "わたしはむすめをじゆうにあそばせました。",
            "meaningBn": "আমি আমার কন্যাকে মুক্তভাবে খেলতে অনুমতি দিয়েছি",
            "note": null
          },
          {
            "jp": "わたしはこどもにみちのみぎがわをあるかせます。",
            "meaningBn": "আমি বাচ্চাকে রাস্তার ডানদিকে দিয়ে হাঁটতে বলেছি",
            "note": null
          },
          {
            "jp": "あさはいそがしいですから、むすめにあさごはんのじゅんびをてつだわせます。",
            "meaningBn": "সকালে ব্যস্ত থাকায় মেয়েকে সকালের নাস্তা তৈরিতে সাহায্য করতে বলি",
            "note": null
          },
          {
            "jp": "せんせいはせいとにじゆうにいけんをいわせました。",
            "meaningBn": "শিক্ষক ছাত্র-ছাত্রীদের অবাধে নিজের মতামত মুক্তভাবে বলতে দিলেন",
            "note": null
          }
        ]
      },
      {
        "id": "48-3",
        "title": "Causative — Usage",
        "structure": "Causative Verb",
        "particles": [
          "causative"
        ],
        "examples": [
          {
            "jp": "わたしはぶちょうにせつめいしていただきました。",
            "meaningBn": "আমি বিভাগীয় প্রধানের দ্বারা ব্যাখ্যা করিয়েছিলাম",
            "note": null
          },
          {
            "jp": "わたしはともだちにせつめいしてもらいました。",
            "meaningBn": "আমার একটি বন্ধু ব্যাখ্যা করিয়েছিলাম",
            "note": null
          }
        ]
      },
      {
        "id": "48-4",
        "title": "させていただけませんか — Asking Permission",
        "structure": "Causative Verb て-Form + いただけませんか",
        "particles": [
          "dake",
          "te-form",
          "causative"
        ],
        "examples": [
          {
            "jp": "いいせんせいをしょうかいしていただけませんか。",
            "meaningBn": "দয়াকরে একজন ভালো শিক্ষক এর সাথে পরিচয় করিয়ে দিবেন?",
            "note": null
          },
          {
            "jp": "ともだちのけっこんしきがあるので、はやくかえらせていただけませんか。",
            "meaningBn": "আমার বন্ধুর বিয়ের অনুষ্ঠান হবে, দয়াকরে আমাকে একটু তাড়াতাড়ি ছেড়ে যাওয়ার অনুমতি দিবেন?",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 49,
    "title": "Lesson 49",
    "points": [
      {
        "id": "49-1",
        "title": "けいご — Honorific Overview",
        "structure": "Honorific Expression",
        "particles": [
          "honorific"
        ],
        "examples": []
      },
      {
        "id": "49-2",
        "title": "そんけいご — Respectful Expressions",
        "structure": "お + Verb (ます-stem) + になります\nお / ご + Noun",
        "particles": [
          "honorific"
        ],
        "examples": [
          {
            "jp": "なかむらさんは7じにきたられます。",
            "meaningBn": "নাকামুরা সান সকালে আসবেন",
            "note": null
          },
          {
            "jp": "おさけをやめられたんですか。",
            "meaningBn": "আপনি কি মদ ছেড়ে দিয়েছেন?",
            "note": null
          },
          {
            "jp": "しゃちょうはもうかえりになりました。",
            "meaningBn": "কোম্পানির প্রধান ইতিমধ্যে বাড়িতে চলে গিয়েছেন",
            "note": null
          },
          {
            "jp": "ワットせんせいはけんきゅうしつにいらっしゃいます。",
            "meaningBn": "ওয়াত সেনসেই গবেষণা কক্ষে আছেন",
            "note": null
          },
          {
            "jp": "どうぞめしあがってください。……ありがとうございます。",
            "meaningBn": "দয়াকরে খেয়ে নিন — ধন্যবাদ",
            "note": null
          },
          {
            "jp": "どうぞおはいりください。",
            "meaningBn": "দয়াকরে ভিতরে আসুন",
            "note": null
          },
          {
            "jp": "わすれものにごちゅういください。",
            "meaningBn": "কোন কিছু যাতে রেখে না যান তাদিকে দয়াকরে লক্ষ্য রাখুন",
            "note": null
          },
          {
            "jp": "またいらっしゃってください。",
            "meaningBn": "দয়াকরে আবার আসুন",
            "note": null
          },
          {
            "jp": "ぶちょうのおくさまもごいっしょにゴルフにいかれました。",
            "meaningBn": "বিভাগীয় প্রধান এবং তার স্ত্রীও একসাথে গলফ খেলতে গিয়েছিলেন",
            "note": null
          }
        ]
      },
      {
        "id": "49-3",
        "title": "けいご + Plain Style",
        "structure": "Honorific + Plain Style",
        "particles": [
          "honorific"
        ],
        "examples": [
          {
            "jp": "ぶちょうはなんじにいらっしゃる?",
            "meaningBn": "বিভাগীয় প্রধান কয়টায় পৌঁছাবেন মতে হয়?",
            "note": null
          }
        ]
      },
      {
        "id": "49-4",
        "title": "〜まして — Polite て-Form",
        "structure": "Verb (ます-stem) + まして",
        "particles": [
          "mashite"
        ],
        "examples": [
          {
            "jp": "バンスがゆうべねつをだしまして、けさもまださがらないんです。",
            "meaningBn": "ভান্স গতকাল রাতে জ্বর হয়েছে, আজ সকালেও কমেনি",
            "note": null
          }
        ]
      },
      {
        "id": "49-5",
        "title": "〜ますので — Polite Reason",
        "structure": "Verb ます + ので",
        "particles": [
          "node"
        ],
        "examples": [
          {
            "jp": "きょうは、がっこうをやすませますので、せんせいによろしくおつたえください。",
            "meaningBn": "আজ ছুটি নিচ্ছি, দয়াকরে আমার শিক্ষকদের জানাবেন",
            "note": null
          }
        ]
      }
    ]
  },
  {
    "lesson": 50,
    "title": "Lesson 50",
    "points": [
      {
        "id": "50-1",
        "title": "けんじょうごI — Humble Verbs I",
        "structure": "お + Verb (ます-stem) + します\nご + Noun + します",
        "particles": [
          "humble"
        ],
        "examples": [
          {
            "jp": "おもそうですね。おもちしましょうか。",
            "meaningBn": "অনেক ভারী মনে হচ্ছে, আমি কি আপনার জন্য এটি বহন করতে পারি?",
            "note": null
          },
          {
            "jp": "わたしがしゃちょうにスジュールをおしらせします。",
            "meaningBn": "আমি প্রেসিডেন্টকে তার সূচি সম্পর্কে অবহিত করবো",
            "note": null
          },
          {
            "jp": "あにがくるまでおおくりします。",
            "meaningBn": "আমার বড় ভাই আপনাকে তার গাড়িতে করে দিয়ে যাবেন",
            "note": null
          },
          {
            "jp": "えどとうきょうはくぶつかんへごあんないします。",
            "meaningBn": "আমি আপনাকে এদো টোকিও জাদুঘরে নিয়ে যাব",
            "note": null
          },
          {
            "jp": "きょうのよていをごせつめいします。",
            "meaningBn": "আমি আপনাকে আজকের পরিকল্পনা ব্যাখা করে দিবো",
            "note": null
          },
          {
            "jp": "しゃちょうのおくさまにおめにかかりました。",
            "meaningBn": "আমি কোম্পানির প্রধানের স্ত্রীর সাথে দেখা করেছিলাম",
            "note": null
          },
          {
            "jp": "あしたはだれがてつだいにきてくれますか。……わたしがなにいます。",
            "meaningBn": "আগামীকাল কে সাহায্য করতে আসবে? — আমি আসছি",
            "note": null
          }
        ]
      },
      {
        "id": "50-2",
        "title": "けんじょうごII — Humble Verbs II",
        "structure": "Humble Verb (まいります / もうします / いたします)",
        "particles": [
          "humble"
        ],
        "examples": [
          {
            "jp": "わたしはミラーともうします。",
            "meaningBn": "আমার নাম মিলার",
            "note": null
          },
          {
            "jp": "アメリカからまいりました。",
            "meaningBn": "আমি আমেরিকা থেকে এসেছিলাম",
            "note": null
          }
        ]
      }
    ]
  }
];
