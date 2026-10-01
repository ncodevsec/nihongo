// N5 grammar notes. Each rule ("point") has:
//   id         "[lesson]-[rule]"; also the name of its description file md/<id>.md
//   title      short rule name / topic (shown as the heading)
//   structure  the sentence pattern the rule builds. " + " separates parts
//              (rendered as chips); a new line starts another pattern.
//   particles  grammar-element tags (see grammar-elements.js) for grouping
//   examples   [{ jp, meaningBn, note? }] — hiragana/katakana only (no kanji)
// The long description is Markdown, kept in md/<id>.md (see md/README.md).

export const GRAMMAR_N5 = [
  {
    "lesson": 1,
    "title": "Lesson 1",
    "points": [
      {
        "id": "1-1",
        "title": "は — Topic Marker & です",
        "structure": "Noun1/Subject + は + Noun2/Object + です",
        "particles": [
          "wa"
        ],
        "examples": [
          {
            "jp": "ミラーさんは いしゃです。",
            "meaningBn": "মি. মিরা হয় ডাক্তার।"
          },
          {
            "jp": "アナさんは ぎんこういんです。",
            "meaningBn": "মিস আনা হয় ব্যাংক কর্মকর্তা।"
          },
          {
            "jp": "わたしは がくせいです。",
            "meaningBn": "আমি হই ছাত্র।"
          }
        ]
      },
      {
        "id": "1-2",
        "title": "じゃありません — Negative Noun Sentence",
        "structure": "Noun1/Subject + は + Noun2/Object + じゃ/では ありません",
        "particles": [
          "wa",
          "de"
        ],
        "examples": [
          {
            "jp": "ミラーさんは いしゃじゃありません。",
            "meaningBn": "মি. মিরা ডাক্তার না।"
          },
          {
            "jp": "わたしは がくせいじゃありません。",
            "meaningBn": "আমি ছাত্র না।"
          },
          {
            "jp": "アナさんは ぎんこういんでは ありません。",
            "meaningBn": "মিস আনা ব্যাংক কর্মকর্তা না।"
          }
        ]
      },
      {
        "id": "1-3",
        "title": "か — Yes/No Question",
        "structure": "Noun1/Subject + は + Noun2/Object + ですか (Interrogative sentence)",
        "particles": [
          "wa"
        ],
        "examples": [
          {
            "jp": "ミラーさんは いしゃですか。",
            "meaningBn": "মি. মিরা কি ডক্টর?"
          },
          {
            "jp": "ロニーさんは ぎんこういんですか。",
            "meaningBn": "মি. রনি কি ব্যাংক কর্মকর্তা?"
          },
          {
            "jp": "サントスさんは せんせいですか。",
            "meaningBn": "মি. সন্তোষ কি শিক্ষক?"
          }
        ]
      },
      {
        "id": "1-4",
        "title": "も — \"Also / Too\"",
        "structure": "Noun + も",
        "particles": [
          "mo"
        ],
        "examples": [
          {
            "jp": "ロニーさんは がくせいです。ミラーさんも がくせいです。ロヒモさんも がくせいです。",
            "meaningBn": "মি. রনি হয় ছাত্র, মি. মিরাও ছাত্র, মি. রহিমও ছাত্র।"
          },
          {
            "jp": "ロニーさんは いしゃです。ミラーさんも いしゃです。ロヒモさんも いしゃです。",
            "meaningBn": "মি. রনি হয় ডাক্তার, মি. মিরাও ডাক্তার, মি. রহিমও ডাক্তার।"
          },
          {
            "jp": "アナさんは がくせいです。サントスさんも がくせいです。",
            "meaningBn": "মিস আনা ছাত্রী, মি. সন্তোষও ছাত্র।"
          }
        ]
      },
      {
        "id": "1-5",
        "title": "の — Possession & Noun Link",
        "structure": "Noun1 + の + Noun2",
        "particles": [
          "no"
        ],
        "examples": [
          {
            "jp": "ミラーさんは ふじだいがくの がくせいです。",
            "meaningBn": "মি. মিরা ফুজি বিশ্ববিদ্যালয়ের ছাত্র।"
          },
          {
            "jp": "ロニーさんは IMCの しゃいんです。",
            "meaningBn": "মি. রনি আই.এম.সি-র কর্মকর্তা।"
          },
          {
            "jp": "アナさんは にほんごがっこうの せんせいです。",
            "meaningBn": "মিস আনা জাপানি ভাষা স্কুলের শিক্ষিকা।"
          }
        ]
      },
      {
        "id": "1-6",
        "title": "さん・ちゃん・くん — Name Suffixes",
        "structure": "Name + さん / ちゃん / くん",
        "particles": [
          "san-chan-kun"
        ],
        "examples": [
          {
            "jp": "ミラーさん",
            "meaningBn": "মিস্টার/মিস মিরা (প্রাপ্তবয়স্ক, সম্মানসূচক)"
          },
          {
            "jp": "はなちゃん",
            "meaningBn": "ছোট্ট হানা (শিশু, স্নেহসূচক)"
          },
          {
            "jp": "たろうくん",
            "meaningBn": "তারো (ছোট ছেলে)"
          }
        ]
      }
    ]
  },
  {
    "lesson": 2,
    "title": "Lesson 2",
    "points": [
      {
        "id": "2-1",
        "title": "これ・それ・あれ — Pointing at Things",
        "structure": "これ / それ / あれ + は + Noun + です",
        "particles": [
          "kore-sore-are"
        ],
        "examples": [
          {
            "jp": "これは じしょです。",
            "meaningBn": "এটা হয় ডিকশনারি।"
          },
          {
            "jp": "あれは ほんです。",
            "meaningBn": "ওটা হয় বই।"
          },
          {
            "jp": "それは とけいです。",
            "meaningBn": "সেটা হয় ঘড়ি।"
          }
        ]
      },
      {
        "id": "2-2",
        "title": "この・その・あの — Demonstrative + Noun",
        "structure": "この / その / あの + Noun + は + …",
        "particles": [
          "kono-sono-ano"
        ],
        "examples": [
          {
            "jp": "この ほんは わたしのです。",
            "meaningBn": "এই বই আমার।"
          },
          {
            "jp": "あの ひとは だれですか。",
            "meaningBn": "ওই ব্যক্তি কে?"
          },
          {
            "jp": "その くつは たかいです。",
            "meaningBn": "সেই জুতাটি দামী।"
          }
        ]
      },
      {
        "id": "2-3",
        "title": "の — Ownership",
        "structure": "Noun₁ + の + Noun₂",
        "particles": [
          "no"
        ],
        "examples": [
          {
            "jp": "これは わたしの ほんです。",
            "meaningBn": "এটা আমার বই।"
          },
          {
            "jp": "あの ひとの かばんは どれですか。",
            "meaningBn": "ওই ব্যক্তির ব্যাগ কোনটি?"
          },
          {
            "jp": "ミラーさんの じしょは これです。",
            "meaningBn": "মিস্টার মিরার ডিকশনারি এটা।"
          }
        ]
      },
      {
        "id": "2-4",
        "title": "か…か — Choice Question",
        "structure": "Noun₁ + ですか、 + Noun₂ + ですか",
        "particles": [
          "ka"
        ],
        "examples": [
          {
            "jp": "これは「きゅう」ですか、「なな」ですか。",
            "meaningBn": "এটি কি ৯ নাকি ৭?"
          },
          {
            "jp": "それは「きゅう」です。",
            "meaningBn": "এটি ৯।"
          },
          {
            "jp": "あれは にほんごの ほんですか、えいごの ほんですか。",
            "meaningBn": "ওটা কি জাপানি বই নাকি ইংরেজি বই?"
          }
        ]
      }
    ]
  },
  {
    "lesson": 3,
    "title": "Lesson 3",
    "points": [
      {
        "id": "3-1",
        "title": "ここ・そこ・あそこ・どこ — Places",
        "structure": "ここ / そこ / あそこ / どこ + です",
        "particles": [
          "doko"
        ],
        "examples": [
          {
            "jp": "しょくどうは そこです。",
            "meaningBn": "ক্যান্টিন হয় ওখানে।"
          },
          {
            "jp": "おてあらいは あそこです。",
            "meaningBn": "টয়লেট হয় ওইখানে।"
          },
          {
            "jp": "ミラーさんは じむしょです。",
            "meaningBn": "মিস্টার মিরা অফিসে।"
          }
        ]
      },
      {
        "id": "3-2",
        "title": "Place は Noun です",
        "structure": "Noun (place) + は + Noun/Subject + です",
        "particles": [
          "wa"
        ],
        "examples": [
          {
            "jp": "そこは しょくどうです。",
            "meaningBn": "ওখানে হয় ক্যান্টিন।"
          },
          {
            "jp": "あそこは じむしょです。",
            "meaningBn": "ওখানে হয় অফিস।"
          },
          {
            "jp": "ここは きょうしつです。",
            "meaningBn": "এখানে হয় শ্রেণিকক্ষ।"
          }
        ]
      },
      {
        "id": "3-3",
        "title": "どこ・どちら — Asking Location",
        "structure": "Place + は + どこ / どちら + ですか",
        "particles": [
          "doko",
          "dochira"
        ],
        "examples": [
          {
            "jp": "おてあらいは どこですか。",
            "meaningBn": "রেস্টরুম কোথায়?"
          },
          {
            "jp": "おてあらいは どちらですか。",
            "meaningBn": "রেস্টরুম কোন দিকে?"
          },
          {
            "jp": "［お］くには どちらですか。",
            "meaningBn": "তোমার দেশ কোথায়?"
          }
        ]
      }
    ]
  },
  {
    "lesson": 4,
    "title": "Lesson 4",
    "points": [
      {
        "id": "4-1",
        "title": "〜時〜分 — Telling Time",
        "structure": "Number + じ + Number + ふん／ぷん + です",
        "particles": [
          "toki"
        ],
        "examples": [
          {
            "jp": "よじ ごじゅうろっぷんです。",
            "meaningBn": "৪টা ৫৬ মিনিট।"
          },
          {
            "jp": "ろくじ きゅうふんです。",
            "meaningBn": "৬টা ৯ মিনিট।"
          },
          {
            "jp": "にじ さんじゅっぷん、はんです。",
            "meaningBn": "২টা ৩০ মিনিট, অর্থাৎ সাড়ে ২টা।"
          }
        ]
      },
      {
        "id": "4-2",
        "title": "〜ます — Polite Verb Tenses",
        "structure": "Verb + ます / ません / ました / ませんでした",
        "particles": [
          "masu-form"
        ],
        "examples": [
          {
            "jp": "わたしは いま はたらきます。",
            "meaningBn": "আমি এখন কাজ করতেছি।"
          },
          {
            "jp": "わたしは きょう はたらきません。",
            "meaningBn": "আমি আজকে কাজ করতেছি না।"
          },
          {
            "jp": "わたしは きのう はたらきました。",
            "meaningBn": "আমি গতকাল কাজ করেছিলাম।"
          }
        ]
      },
      {
        "id": "4-3",
        "title": "に — Time Marker",
        "structure": "Noun(time) + に + verb",
        "particles": [
          "ni"
        ],
        "examples": [
          {
            "jp": "わたしは あした ろくじに おきます。",
            "meaningBn": "আমি আগামীকাল ৬টায় ঘুম থেকে উঠবো।"
          },
          {
            "jp": "わたしは げつようびに にほんへ いきます。",
            "meaningBn": "আমি সোমবারে জাপানে যাবো।"
          },
          {
            "jp": "たんじょうびは しがつに あります。",
            "meaningBn": "জন্মদিন এপ্রিলে আছে।"
          }
        ]
      },
      {
        "id": "4-4",
        "title": "から〜まで — \"From … To …\"",
        "structure": "Noun₁ + から + Noun₂ + まで",
        "particles": [
          "kara",
          "made"
        ],
        "examples": [
          {
            "jp": "わたしは くじから ごじまで はたらきます。",
            "meaningBn": "আমি ৯টা থেকে ৫টা পর্যন্ত কাজ করি।"
          },
          {
            "jp": "がっこうは げつようびから きんようびまでです。",
            "meaningBn": "স্কুল সোমবার থেকে শুক্রবার পর্যন্ত।"
          },
          {
            "jp": "とうきょうから おおさかまで しんかんせんで いきます。",
            "meaningBn": "টোকিও থেকে ওসাকা পর্যন্ত শিনকানসেন দিয়ে যাই।"
          }
        ]
      },
      {
        "id": "4-5",
        "title": "と — \"And\" (Nouns)",
        "structure": "Noun1 + と + Noun2",
        "particles": [
          "to"
        ],
        "examples": [
          {
            "jp": "ぎんこうの やすみは どようびと にちようびです。",
            "meaningBn": "ব্যাংকের ছুটি শনিবার এবং রবিবার।"
          },
          {
            "jp": "つくえの うえに ほんと じしょが あります。",
            "meaningBn": "ডেস্কের উপর বই এবং ডিকশনারি আছে।"
          },
          {
            "jp": "せんせいと がくせいが きました。",
            "meaningBn": "শিক্ষক এবং ছাত্র এসেছে।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 5,
    "title": "Lesson 5",
    "points": [
      {
        "id": "5-1",
        "title": "へ — Direction Marker",
        "structure": "Noun(place) + へ + いきます/きます/かえります",
        "particles": [
          "e"
        ],
        "examples": [
          {
            "jp": "わたしは コックスバザールへ いきます。",
            "meaningBn": "আমি কক্সবাজারে যাবো।"
          },
          {
            "jp": "わたしは にほんへ きました。",
            "meaningBn": "আমি জাপানে এসেছি।"
          },
          {
            "jp": "わたしは うちへ かえります。",
            "meaningBn": "আমি বাড়িতে ফিরবো।"
          }
        ]
      },
      {
        "id": "5-2",
        "title": "どこ(へ)も — Negative Question Words",
        "structure": "どこ（へ）も + いきません / いきませんでした",
        "particles": [
          "mo",
          "e",
          "doko"
        ],
        "examples": [
          {
            "jp": "あした どこへ いきますか。……どこも いきません。",
            "meaningBn": "আগামীকাল কোথায় যাবেন? ……কোথাও যাবো না।"
          },
          {
            "jp": "きのう どこへ いきましたか。……どこも いきませんでした。",
            "meaningBn": "গতকাল কোথায় গিয়েছিলেন? ……কোথাও যাইনি।"
          },
          {
            "jp": "きょうしつに だれも いません。",
            "meaningBn": "শ্রেণিকক্ষে কেউ নেই।"
          }
        ]
      },
      {
        "id": "5-3",
        "title": "で — \"By\" (Transport)",
        "structure": "Noun(যানবাহন) + で + いきます/きます/かえります",
        "particles": [
          "de"
        ],
        "examples": [
          {
            "jp": "でんしゃで とうきょうへ いきます。",
            "meaningBn": "ট্রেন দিয়ে টোকিও যাবো।"
          },
          {
            "jp": "なんで かいしゃへ いきますか。……バスで いきます。",
            "meaningBn": "কী দিয়ে কোম্পানিতে যান? ……বাস দিয়ে যাই।"
          },
          {
            "jp": "ひこうきで にほんへ きました。",
            "meaningBn": "বিমান দিয়ে জাপানে এসেছি।"
          }
        ]
      },
      {
        "id": "5-4",
        "title": "と — \"With\" (Person / Animal)",
        "structure": "Noun(ব্যক্তি, প্রাণী) + と + verb",
        "particles": [
          "to"
        ],
        "examples": [
          {
            "jp": "かぞくと にほんへ きました。",
            "meaningBn": "পরিবারের সাথে জাপানে এসেছি।"
          },
          {
            "jp": "ともだちと がっこうへ いきます。",
            "meaningBn": "বন্ধুর সাথে স্কুলে যাবো।"
          },
          {
            "jp": "いぬと こうえんへ いきます。",
            "meaningBn": "কুকুরের সাথে পার্কে যাবো।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 6,
    "title": "Lesson 6",
    "points": [
      {
        "id": "6-1.1",
        "title": "Transitive Verb",
        "structure": "Object + を + Verb (Transitive)",
        "particles": [
          "wo"
        ],
        "examples": [
          {
            "jp": "けさ コーヒーを のみました。",
            "meaningBn": "আজ সকালে কফি পান করেছিলাম।"
          },
          {
            "jp": "あした サッカーを します。",
            "meaningBn": "আগামীকাল ফুটবল খেলবো।"
          },
          {
            "jp": "しゅくだいを します。",
            "meaningBn": "বাড়ির কাজ করবো।"
          }
        ]
      },
      {
        "id": "6-1.2",
        "title": "Intransitive Verb",
        "structure": "Noun + に + Verb (Intransitive)",
        "particles": [
          "wo"
        ],
        "examples": [
          {
            "jp": "つくえの うえに あります。",
            "meaningBn": "টেবিলের উপরে আছে।"
          },
          {
            "jp": "バスに のります。",
            "meaningBn": "বাসে উঠি।"
          },
          {
            "jp": "いすに すわります。",
            "meaningBn": "চেয়ারে বসি।"
          },
          {
            "jp": "きょうとに すみます。",
            "meaningBn": "কিয়োটোতে থাকি।"
          },
          {
            "jp": "へやに はいります。",
            "meaningBn": "ঘরে প্রবেশ করি।"
          }
        ]
      },
      {
        "id": "6-1.3",
        "title": "Intransitive Verb",
        "structure": "Noun + が + Verb (Intransitive)",
        "particles": [
          "wo"
        ],
        "examples": [
          {
            "jp": "にほんごが わかります。",
            "meaningBn": "জাপানি বুঝি।"
          },
          {
            "jp": "しごとが はじまります。",
            "meaningBn": "কাজ শুরু হয়।"
          },
          {
            "jp": "ゆきが ふります。",
            "meaningBn": "তুষারপাত হয়।"
          },
          {
            "jp": "にほんごが できます。",
            "meaningBn": "জাপানি পারি।"
          },
          {
            "jp": "おかねが いります。",
            "meaningBn": "টাকা প্রয়োজন।"
          },
          {
            "jp": "かぜが ふきます。",
            "meaningBn": "বাতাস প্রবাহিত হয়।"
          }
        ]
      },
      {
        "id": "6-2",
        "title": "なに・なん — \"What\"",
        "structure": "なに + が / も / を\nなん + Other Particles",
        "particles": [
          "nani"
        ],
        "examples": [
          {
            "jp": "あした なにを しますか。",
            "meaningBn": "আগামীকাল কী করবেন?"
          },
          {
            "jp": "それは なんですか。",
            "meaningBn": "সেটা কী?"
          },
          {
            "jp": "なにも たべませんでした。",
            "meaningBn": "কিছুই খাইনি।"
          }
        ]
      },
      {
        "id": "6-3",
        "title": "で — Place of Action",
        "structure": "Noun(Place) + で + Verb (Action of Place)",
        "particles": [
          "de"
        ],
        "examples": [
          {
            "jp": "えきで しんぶんを かいました。",
            "meaningBn": "স্টেশন থেকে পত্রিকা কিনেছি।"
          },
          {
            "jp": "えきで ともだちと あいました。",
            "meaningBn": "স্টেশনে বন্ধুর সাথে দেখা করেছিলাম।"
          },
          {
            "jp": "こうえんで サッカーを しました。",
            "meaningBn": "পার্কে ফুটবল খেলেছিলাম।"
          }
        ]
      },
      {
        "id": "6-4",
        "title": "〜ませんか — Invitation",
        "structure": "Verb (ます-stem) + ませんか",
        "particles": [
          "masu-form"
        ],
        "examples": [
          {
            "jp": "いっしょに おちゃを のみませんか。",
            "meaningBn": "একসাথে চা পান করবেন কি?"
          },
          {
            "jp": "いっしょに えいがを みませんか。",
            "meaningBn": "একসাথে সিনেমা দেখবেন কি?"
          },
          {
            "jp": "にちようび テニスを しませんか。",
            "meaningBn": "রবিবার টেনিস খেলবেন কি?"
          }
        ]
      },
      {
        "id": "6-5",
        "title": "〜ましょう — \"Let's …\"",
        "structure": "Verb (ます-stem) + ましょう",
        "particles": [
          "masu-form",
          "volitional"
        ],
        "examples": [
          {
            "jp": "いっしょに ごはんを たべませんか。……ええ、たべましょう。",
            "meaningBn": "একসাথে খাবার খাবেন কি? ……হ্যাঁ, চলো খাই।"
          },
          {
            "jp": "ちょっと やすみましょう。",
            "meaningBn": "একটু বিশ্রাম নেই।"
          },
          {
            "jp": "また あした あいましょう。",
            "meaningBn": "আবার আগামীকাল দেখা করি।"
          }
        ]
      },
      {
        "id": "6-6",
        "title": "に・が — Exceptions to を",
        "structure": "Noun + に + あいます / のります / つきます\nNoun + が + わかります / できます / あります",
        "particles": [
          "ga",
          "ni"
        ],
        "examples": [
          {
            "jp": "えきで ともだちに あいました。",
            "meaningBn": "স্টেশনে বন্ধুর সাথে দেখা করেছি।"
          },
          {
            "jp": "でんしゃに のります。",
            "meaningBn": "ট্রেনে উঠি।"
          },
          {
            "jp": "にほんごが わかります。",
            "meaningBn": "জাপানি ভাষা বুঝি।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 7,
    "title": "Lesson 7",
    "points": [
      {
        "id": "7-1",
        "title": "で — \"By Means Of\" (Tool)",
        "structure": "Noun(যন্ত্র/means) + で + Verb",
        "particles": [
          "de"
        ],
        "examples": [
          {
            "jp": "はしで たべます。",
            "meaningBn": "চপস্টিক দিয়ে খাই।"
          },
          {
            "jp": "にほんごで レポートを かきます。",
            "meaningBn": "জাপানি ভাষা দিয়ে রিপোর্ট লিখি।"
          },
          {
            "jp": "えんぴつで じを かきます。",
            "meaningBn": "পেন্সিল দিয়ে অক্ষর লিখি।"
          }
        ]
      },
      {
        "id": "7-2",
        "title": "〜語で なんですか — Asking a Word",
        "structure": "Word + は + Language語 + で + なんですか",
        "particles": [
          "wa",
          "de",
          "ndesu"
        ],
        "examples": [
          {
            "jp": "「ありがとう」は えいごで なんですか。……「Thank you」です。",
            "meaningBn": "'আরিগাতো' ইংরেজি ভাষায় কী বলে? ……Thank you।"
          },
          {
            "jp": "これは にほんごで なんですか。",
            "meaningBn": "এটা জাপানি ভাষায় কী বলে?"
          },
          {
            "jp": "「Book」は にほんごで なんですか。",
            "meaningBn": "'Book' জাপানি ভাষায় কী বলে?"
          }
        ]
      },
      {
        "id": "7-3",
        "title": "あげます・かします・おしえます — Giving",
        "structure": "N(person) + に + あげます/かします/おしえます",
        "particles": [
          "ni",
          "ageru-morau-kureru"
        ],
        "examples": [
          {
            "jp": "やまださんは きむらさんに はなを あげました。",
            "meaningBn": "মিস্টার ইয়ামাদা মিস কিমুরাকে ফুল দিয়েছে।"
          },
          {
            "jp": "ミラーさんに ほんを かしました。",
            "meaningBn": "মিস্টার মিরাকে বই ধার দিয়েছিলাম।"
          },
          {
            "jp": "こどもに にほんごを おしえます。",
            "meaningBn": "শিশুকে জাপানি ভাষা শেখাই।"
          }
        ]
      },
      {
        "id": "7-4",
        "title": "もらいます・かります・ならいます — Receiving",
        "structure": "N(person) + に + もらいます/かります/ならいます",
        "particles": [
          "ni",
          "ageru-morau-kureru"
        ],
        "examples": [
          {
            "jp": "きむらさんは やまださんに はなを もらいました。",
            "meaningBn": "মিস কিমুরা মিস্টার ইয়ামাদা থেকে ফুল পেয়েছে।"
          },
          {
            "jp": "かりなさんに CDを かりました。",
            "meaningBn": "মিস কারিনা থেকে সিডি ধার পেয়েছি।"
          },
          {
            "jp": "せんせいに にほんごを ならいました。",
            "meaningBn": "শিক্ষকের থেকে জাপানি ভাষা শিখেছি।"
          }
        ]
      },
      {
        "id": "7-5",
        "title": "もう〜ました — \"Already\"",
        "structure": "もう + V-ました",
        "particles": [
          "mou"
        ],
        "examples": [
          {
            "jp": "もう にもつを おくりましたか。……はい、もう おくりました。",
            "meaningBn": "ইতিমধ্যে কি পার্সেল পাঠিয়ে দিয়েছেন? ……হ্যাঁ, ইতিমধ্যে পাঠিয়ে দিয়েছি।"
          },
          {
            "jp": "もう ひるごはんを たべましたか。……いいえ、まだです。",
            "meaningBn": "ইতিমধ্যে দুপুরের খাবার খেয়েছেন? ……না, এখনো না।"
          },
          {
            "jp": "もう しゅくだいを しました。",
            "meaningBn": "ইতিমধ্যে বাড়ির কাজ করে ফেলেছি।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 8,
    "title": "Lesson 8",
    "points": [
      {
        "id": "8-1",
        "title": "い-Adj & な-Adj — Adjective Types",
        "structure": "な-Adj: Base + な + Noun\nい-Adj: Base(〜い) + Noun",
        "particles": [
          "i-adjective",
          "na-adjective"
        ],
        "examples": [
          {
            "jp": "しんせつ［な］",
            "meaningBn": "দয়ালু (な-adjective)"
          },
          {
            "jp": "たかい",
            "meaningBn": "উঁচু/দামী (い-adjective)"
          },
          {
            "jp": "きれい［な］",
            "meaningBn": "সুন্দর (な-adjective, ব্যতিক্রম শব্দ)"
          }
        ]
      },
      {
        "id": "8-2",
        "title": "な-Adjective Sentence",
        "structure": "Noun/Subject + は + な-Adjective［な］+ です",
        "particles": [
          "wa",
          "na-adjective"
        ],
        "examples": [
          {
            "jp": "きむらさんは しんせつです。",
            "meaningBn": "মিস্টার কিমুরা দয়ালু।"
          },
          {
            "jp": "きむらさんは しんせつじゃありません。",
            "meaningBn": "মিস্টার কিমুরা দয়ালু না।"
          },
          {
            "jp": "この まちは にぎやかです。",
            "meaningBn": "এই শহর প্রাণবন্ত।"
          }
        ]
      },
      {
        "id": "8-3",
        "title": "い-Adjective Sentence",
        "structure": "Noun/Subject + は + い-Adjective［い］+ です",
        "particles": [
          "wa",
          "i-adjective"
        ],
        "examples": [
          {
            "jp": "ふじさんは たかいです。",
            "meaningBn": "মাউন্ট ফুজি উঁচু।"
          },
          {
            "jp": "ふじさんは たかくないです。",
            "meaningBn": "মাউন্ট ফুজি উঁচু না।"
          },
          {
            "jp": "この りょうりは おいしいです。",
            "meaningBn": "এই খাবারটি সুস্বাদু।"
          }
        ]
      },
      {
        "id": "8-4",
        "title": "な-Adjective + Noun",
        "structure": "Noun/Subject + は + な-Adjective［な］+ Noun です",
        "particles": [
          "wa",
          "na-adjective"
        ],
        "examples": [
          {
            "jp": "きむらさんは しんせつな ひとです。",
            "meaningBn": "মিস্টার কিমুরা দয়ালু ব্যক্তি।"
          },
          {
            "jp": "きむらさんは しんせつです。",
            "meaningBn": "মিস্টার কিমুরা দয়ালু।"
          },
          {
            "jp": "にぎやかな まちが すきです。",
            "meaningBn": "প্রাণবন্ত শহর পছন্দ করি।"
          }
        ]
      },
      {
        "id": "8-5",
        "title": "とても・あまり — Degree Adverbs",
        "structure": "とても + Adj (＋)\nあまり + Adj (−)",
        "particles": [
          "adverb-degree"
        ],
        "examples": [
          {
            "jp": "バングラデシュは とても さむいです。",
            "meaningBn": "বাংলাদেশে অনেক ঠান্ডা।"
          },
          {
            "jp": "バングラデシュは あまり さむくないです。",
            "meaningBn": "বাংলাদেশে তেমন ঠান্ডা না।"
          },
          {
            "jp": "この えいがは とても おもしろいです。",
            "meaningBn": "এই সিনেমাটি অনেক মজার।"
          }
        ]
      },
      {
        "id": "8-6",
        "title": "どうですか — \"How Is …?\"",
        "structure": "Noun + は + どうですか",
        "particles": [
          "wa"
        ],
        "examples": [
          {
            "jp": "ダッカは どうですか。……にぎやかな まちです。",
            "meaningBn": "ঢাকা কেমন? ……একটি প্রাণবন্ত শহর।"
          },
          {
            "jp": "にほんの たべものは どうですか。",
            "meaningBn": "জাপানের খাবার কেমন?"
          },
          {
            "jp": "しごとは どうですか。",
            "meaningBn": "কাজ কেমন চলছে?"
          }
        ]
      },
      {
        "id": "8-7",
        "title": "どんな・が — \"What Kind\" & \"But\"",
        "structure": "Noun1 + は + どんな + Noun2 + ですか / Sentence1が、Sentence2",
        "particles": [
          "wa",
          "ga",
          "donna"
        ],
        "examples": [
          {
            "jp": "コックスバザールは どんな まちですか。……ゆうめいな まちです。",
            "meaningBn": "কক্সবাজার কি ধরনের শহর? ……বিখ্যাত শহর।"
          },
          {
            "jp": "にほんごは どうですか。……にほんごは ちょっと むずかしいですが、おもしろいです。",
            "meaningBn": "জাপানি ভাষা কেমন? ……জাপানি ভাষা একটু কঠিন কিন্তু মজাদার।"
          },
          {
            "jp": "この まちは しずかですが、ふべんです。",
            "meaningBn": "এই শহর শান্ত কিন্তু অসুবিধাজনক।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 9,
    "title": "Lesson 9",
    "points": [
      {
        "id": "9-1",
        "title": "が — あります・わかります",
        "structure": "Noun + が + あります/わかります",
        "particles": [
          "ga"
        ],
        "examples": [
          {
            "jp": "わたしは にほんごが わかります。",
            "meaningBn": "আমি জাপানি ভাষা বুঝি।"
          },
          {
            "jp": "わたしは くるまが あります。",
            "meaningBn": "আমার গাড়ি আছে।"
          },
          {
            "jp": "じかんが ありません。",
            "meaningBn": "সময় নেই।"
          }
        ]
      },
      {
        "id": "9-2",
        "title": "が — Like / Skill Adjectives",
        "structure": "Noun1 + は + Noun2 + が + All Adjective です",
        "particles": [
          "wa",
          "ga"
        ],
        "examples": [
          {
            "jp": "わたしは ビリヤニが すきです。",
            "meaningBn": "আমি বিরিয়ানি পছন্দ করি।"
          },
          {
            "jp": "すずきさんは にほんごが じょうずです。",
            "meaningBn": "মিস্টার সুজুকি জাপানি ভাষায় দক্ষ।"
          },
          {
            "jp": "わたしは さかなが きらいです。",
            "meaningBn": "আমি মাছ অপছন্দ করি।"
          }
        ]
      },
      {
        "id": "9-3",
        "title": "どんな — \"What Kind Of\"",
        "structure": "どんな + Noun (কি ধরনের)",
        "particles": [
          "donna"
        ],
        "examples": [
          {
            "jp": "どんな スポーツが すきですか。……サッカーが すきです。",
            "meaningBn": "কি ধরনের খেলা পছন্দ করেন? ……ফুটবল পছন্দ করি।"
          },
          {
            "jp": "どんな おんがくが すきですか。",
            "meaningBn": "কি ধরনের গান পছন্দ করেন?"
          },
          {
            "jp": "どんな りょうりが すきですか。",
            "meaningBn": "কি ধরনের খাবার পছন্দ করেন?"
          }
        ]
      },
      {
        "id": "9-4",
        "title": "Frequency & Amount Adverbs",
        "structure": "Adverb + Verb / Adjective",
        "particles": [
          "tai",
          "adverb-degree"
        ],
        "examples": [
          {
            "jp": "わたしは ひらがなが よく わかります。",
            "meaningBn": "আমি হিরাগানা খুব ভালো বুঝি।"
          },
          {
            "jp": "わたしは おかねが たくさん あります。",
            "meaningBn": "আমার অনেক টাকা আছে।"
          },
          {
            "jp": "わたしは にほんごが ぜんぜん わかりません。",
            "meaningBn": "আমি জাপানি ভাষা একেবারে বুঝি না।"
          }
        ]
      },
      {
        "id": "9-5",
        "title": "から — \"Because\"",
        "structure": "Sentence1 + から、+ sentence2",
        "particles": [
          "kara"
        ],
        "examples": [
          {
            "jp": "どうして あさ しんぶんを よみませんか。……じかんが ありませんから、しんぶんを よみません。",
            "meaningBn": "কেন সকালে পত্রিকা পড়েন না? ……সময় নেই এজন্য পত্রিকা পড়ি না।"
          },
          {
            "jp": "きょうは いそがしいから、いきません。",
            "meaningBn": "আজকে ব্যস্ত এজন্য যাব না।"
          },
          {
            "jp": "あついから、まどを あけます。",
            "meaningBn": "গরম লাগছে বলে জানালা খুলবো।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 10,
    "title": "Lesson 10",
    "points": [
      {
        "id": "10-1",
        "title": "あります・います — Existence",
        "structure": "Noun + が + あります/います",
        "particles": [
          "ga"
        ],
        "examples": [
          {
            "jp": "わたしは コンピューターが あります。",
            "meaningBn": "আমার কম্পিউটার আছে।"
          },
          {
            "jp": "わたしは こどもが います。",
            "meaningBn": "আমার বাচ্চা আছে।"
          },
          {
            "jp": "にわに ねこが います。",
            "meaningBn": "উঠানে বিড়াল আছে।"
          }
        ]
      },
      {
        "id": "10-2",
        "title": "に…が — Existence at a Place",
        "structure": "Noun(Place) + に + Noun2 + が + あります/います",
        "particles": [
          "ga",
          "ni"
        ],
        "examples": [
          {
            "jp": "きょうしつに がくせいが います。",
            "meaningBn": "ক্লাসরুমে ছাত্র আছে।"
          },
          {
            "jp": "とうきょうに にほんごがっこうが あります。",
            "meaningBn": "টোকিওতে জাপানি ভাষার স্কুল আছে।"
          },
          {
            "jp": "じむしょに つくえと いすが あります。",
            "meaningBn": "অফিসে ডেস্ক এবং চেয়ার আছে।"
          }
        ]
      },
      {
        "id": "10-3",
        "title": "は…に — \"Where Is X?\"",
        "structure": "Noun1 + は + Noun2 + に + あります/います",
        "particles": [
          "wa",
          "ni"
        ],
        "examples": [
          {
            "jp": "がくせいは きょうしつに います。",
            "meaningBn": "ছাত্র ক্লাসরুমে আছে।"
          },
          {
            "jp": "きょうしつに がくせいが います。",
            "meaningBn": "ক্লাসরুমে ছাত্র আছে।"
          },
          {
            "jp": "ねこは にわに います。",
            "meaningBn": "বিড়াল উঠানে আছে।"
          }
        ]
      },
      {
        "id": "10-4",
        "title": "Position Words",
        "structure": "N1(Things/Person/Place) + の + N2(Positional Word) に/で",
        "particles": [
          "ni",
          "de",
          "no"
        ],
        "examples": [
          {
            "jp": "つくえの うえに ほんが あります。",
            "meaningBn": "ডেস্কের উপর বই আছে।"
          },
          {
            "jp": "えきの まえに ぎんこうが ありました。",
            "meaningBn": "স্টেশনের সামনে ব্যাংক ছিল।"
          },
          {
            "jp": "えきの まえで ともだちに あいます。",
            "meaningBn": "স্টেশনের সামনে বন্ধুর সাথে দেখা করি।"
          }
        ]
      },
      {
        "id": "10-5",
        "title": "や…など — Non-exhaustive List",
        "structure": "Noun + や + Noun + など",
        "particles": [
          "ya"
        ],
        "examples": [
          {
            "jp": "はこの なかに しゃしんや ほんなどが あります。",
            "meaningBn": "বাক্সের ভিতরে ছবি ও বই ইত্যাদি আছে।"
          },
          {
            "jp": "はこの なかに しゃしんと ほんが あります。",
            "meaningBn": "বাক্সের ভিতরে ছবি এবং বই আছে।"
          },
          {
            "jp": "つくえの うえに ペンや ノートが あります。",
            "meaningBn": "ডেস্কের উপর কলম ও খাতা ইত্যাদি আছে।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 11,
    "title": "Lesson 11",
    "points": [
      {
        "id": "11-1",
        "title": "どのくらい — \"How Long\"",
        "structure": "どのくらい + Verb ますか",
        "particles": [
          "donokurai"
        ],
        "examples": [
          {
            "jp": "どのくらい にほんごを べんきょうしましたか。……ろっかげつぐらいです。",
            "meaningBn": "কত সময় জাপানি ভাষা পড়াশোনা করেছেন? ……ছয় মাস প্রায়।"
          },
          {
            "jp": "うちから がっこうまで どのくらい かかりますか。……いちじかんぐらいです。",
            "meaningBn": "বাসা থেকে স্কুল পর্যন্ত কত সময় প্রয়োজন? ……১ ঘণ্টা প্রায়।"
          },
          {
            "jp": "どれくらい にほんに いましたか。",
            "meaningBn": "কত সময় জাপানে ছিলেন?"
          }
        ]
      },
      {
        "id": "11-2",
        "title": "に — Frequency in a Period",
        "structure": "Quantifier(Time Period) + に + Verb",
        "particles": [
          "ni"
        ],
        "examples": [
          {
            "jp": "わたしは いちにちに さんかい おちゃを のみます。",
            "meaningBn": "আমি একদিনে তিনবার চা পান করি।"
          },
          {
            "jp": "わたしは いっかげつに いっかい コックスバザールへ いきます。",
            "meaningBn": "আমি একমাসে একবার কক্সবাজার যাই।"
          },
          {
            "jp": "いっしゅうかんに にかい にほんごを べんきょうします。",
            "meaningBn": "সপ্তাহে দুইবার জাপানি ভাষা পড়াশোনা করি।"
          }
        ]
      },
      {
        "id": "11-3",
        "title": "だけ — \"Only\"",
        "structure": "Quantifier/Noun + だけ (Only)",
        "particles": [
          "dake"
        ],
        "examples": [
          {
            "jp": "きょうしつに おんなの がくせいが ひとりだけ います。",
            "meaningBn": "এই ক্লাসরুমে ছাত্রী শুধুমাত্র একজন আছে।"
          },
          {
            "jp": "がっこうの やすみは にちようびだけです。",
            "meaningBn": "স্কুলের ছুটি শুধুমাত্র রবিবার।"
          },
          {
            "jp": "にほんごだけ わかります。",
            "meaningBn": "শুধুমাত্র জাপানি ভাষা বুঝি।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 12,
    "title": "Lesson 12",
    "points": [
      {
        "id": "12-1",
        "title": "Noun & な-Adj — Tenses",
        "structure": "Noun / な-Adj + です / じゃありません / でした / じゃありませんでした",
        "particles": [
          "na-adjective",
          "tense-change"
        ],
        "examples": [
          {
            "jp": "きのうは あめでした。",
            "meaningBn": "গতকাল বৃষ্টি ছিল।"
          },
          {
            "jp": "そこは しずかじゃありませんでした。",
            "meaningBn": "সেখানে শান্ত ছিল না।"
          },
          {
            "jp": "きのうは やすみでした。",
            "meaningBn": "গতকাল ছুটি ছিল।"
          }
        ]
      },
      {
        "id": "12-2",
        "title": "い-Adjective — Tenses",
        "structure": "い-Adj + です / くないです / かったです / くなかったです",
        "particles": [
          "i-adjective",
          "tense-change"
        ],
        "examples": [
          {
            "jp": "きのうは あつかったです。",
            "meaningBn": "গতকাল গরম ছিল।"
          },
          {
            "jp": "テストは むずかしくなかったです。",
            "meaningBn": "পরীক্ষাটি কঠিন ছিল না।"
          },
          {
            "jp": "りょこうは たのしかったです。",
            "meaningBn": "ভ্রমণটি আনন্দদায়ক ছিল।"
          }
        ]
      },
      {
        "id": "12-3",
        "title": "より — Comparison",
        "structure": "Noun1 + は + Noun2 + より + Adjective + です",
        "particles": [
          "wa",
          "yori"
        ],
        "examples": [
          {
            "jp": "この くるまは あの くるまより おおきいです。",
            "meaningBn": "এই গাড়িটি ঐ গাড়ির চেয়ে বড়।"
          },
          {
            "jp": "にほんごは えいごより むずかしいです。",
            "meaningBn": "জাপানি ভাষা ইংরেজির চেয়ে কঠিন।"
          },
          {
            "jp": "きょうは きのうより さむいです。",
            "meaningBn": "আজ গতকালের চেয়ে ঠান্ডা।"
          }
        ]
      },
      {
        "id": "12-4",
        "title": "どちら・いちばん — Comparison & Superlative",
        "structure": "Noun1 と Noun2 と どちらが Adjective ですか / いちばん",
        "particles": [
          "to",
          "dochira"
        ],
        "examples": [
          {
            "jp": "サッカーと やきゅうと どちらが すきですか。……サッカーのほうが すきです。",
            "meaningBn": "ফুটবল এবং বেসবলের মধ্যে কোনটি পছন্দ? ……ফুটবল পছন্দ।"
          },
          {
            "jp": "にほんりょうりの なかで なにが いちばん すきですか。……らめんが いちばん すきです。",
            "meaningBn": "জাপানের খাবারের মধ্যে কী সবচেয়ে বেশি পছন্দ? ……রামেন সবচেয়ে বেশি পছন্দ।"
          },
          {
            "jp": "どちらも すきです。",
            "meaningBn": "দুটোই পছন্দ।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 13,
    "title": "Lesson 13",
    "points": [
      {
        "id": "13-1",
        "title": "ほしい — \"Want (a Thing)\"",
        "structure": "Noun + が + ほしいです",
        "particles": [
          "ga"
        ],
        "examples": [
          {
            "jp": "わたしは くるまが ほしいです。",
            "meaningBn": "আমি গাড়ি চাই।"
          },
          {
            "jp": "ミラーさんは おかねが ほしいです。",
            "meaningBn": "মি. মিরা টাকা চায়।"
          },
          {
            "jp": "あたらしい かばんが ほしいです。",
            "meaningBn": "নতুন ব্যাগ চাই।"
          }
        ]
      },
      {
        "id": "13-2",
        "title": "〜たい — \"Want To (Do)\"",
        "structure": "Verb (ます-stem) + たいです",
        "particles": [
          "masu-form",
          "tai"
        ],
        "examples": [
          {
            "jp": "わたしは ビールを のみたいです。",
            "meaningBn": "আমি বিয়ার পান করতে চাই।"
          },
          {
            "jp": "わたしは にほんへ いきたいです。",
            "meaningBn": "আমি জাপানে যেতে চাই।"
          },
          {
            "jp": "はやく いえに かえりたいです。",
            "meaningBn": "তাড়াতাড়ি বাড়িতে ফিরতে চাই।"
          }
        ]
      },
      {
        "id": "13-3",
        "title": "〜に いきます — Go To Do",
        "structure": "Noun(Place) + へ + Noun(V-Stem) に + いきます/きます/かえります",
        "particles": [
          "ni",
          "e"
        ],
        "examples": [
          {
            "jp": "わたしは にほんへ べんきょうに いきます。",
            "meaningBn": "আমি জাপানে লেখাপড়ার জন্য যাবো।"
          },
          {
            "jp": "わたしは くにへ あそびに かえります。",
            "meaningBn": "আমি দেশে বেড়ানোর জন্য ফিরবো।"
          },
          {
            "jp": "わたしは がっこうへ にほんごを ならいに きました。",
            "meaningBn": "আমি স্কুলে জাপানি ভাষা শিক্ষার জন্য এসেছি।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 14,
    "title": "Lesson 14",
    "points": [
      {
        "id": "14-1",
        "title": "て-Form — Verb Groups & Formation",
        "structure": "Verb (ます-stem) → て-Form",
        "particles": [
          "te-form"
        ],
        "examples": [
          {
            "jp": "まちます → まって",
            "meaningBn": "অপেক্ষা করা (Group-1)"
          },
          {
            "jp": "たべます → たべて",
            "meaningBn": "খাওয়া (Group-2)"
          },
          {
            "jp": "します → して",
            "meaningBn": "করা (Group-3)"
          }
        ]
      },
      {
        "id": "14-2",
        "title": "〜てください — Request",
        "structure": "Verb て-Form + ください",
        "particles": [
          "te-form"
        ],
        "examples": [
          {
            "jp": "すみませんが、この かんじの よみかたを おしえてください。",
            "meaningBn": "অনুগ্রহ করে এই কানজি পড়ার পদ্ধতি বলে দিন।"
          },
          {
            "jp": "どうぞ たくさん たべてください。",
            "meaningBn": "অনুগ্রহ করে বেশি করে খাবেন।"
          },
          {
            "jp": "ちょっと まってください。",
            "meaningBn": "একটু অপেক্ষা করুন।"
          }
        ]
      },
      {
        "id": "14-3",
        "title": "〜ています — Ongoing Action",
        "structure": "Verb て-Form + います",
        "particles": [
          "te-form"
        ],
        "examples": [
          {
            "jp": "わたしは いま かいています。",
            "meaningBn": "আমি এখন লিখছি।"
          },
          {
            "jp": "アルマンさんは いま にほんごを べんきょうしています。",
            "meaningBn": "মি. আরমান এখন জাপানি ভাষা পড়াচ্ছেন।"
          },
          {
            "jp": "あめが ふっています。",
            "meaningBn": "বৃষ্টি পড়তেছে।"
          }
        ]
      },
      {
        "id": "14-4",
        "title": "〜ましょうか — Offering Help",
        "structure": "Verb (ます-stem) + ましょうか",
        "particles": [
          "masu-form",
          "volitional"
        ],
        "examples": [
          {
            "jp": "あしたも きましょうか。",
            "meaningBn": "আগামীকালও আসবো কি?"
          },
          {
            "jp": "てつだいましょうか。",
            "meaningBn": "সাহায্য করবো কি?"
          },
          {
            "jp": "にもつを もちましょうか。",
            "meaningBn": "মালামাল বহন করবো কি?"
          }
        ]
      },
      {
        "id": "14-5",
        "title": "が — ふります etc.",
        "structure": "Noun + が + ふります / ふいています",
        "particles": [
          "ga"
        ],
        "examples": [
          {
            "jp": "あめが ふっています。",
            "meaningBn": "বৃষ্টি পড়তেছে।"
          },
          {
            "jp": "ゆきが ふっています。",
            "meaningBn": "তুষার পড়তেছে।"
          },
          {
            "jp": "かぜが ふいています。",
            "meaningBn": "বাতাস বইছে।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 15,
    "title": "Lesson 15",
    "points": [
      {
        "id": "15-1",
        "title": "〜てもいいです — Permission",
        "structure": "Verb て-Form + もいいですか",
        "particles": [
          "te-form",
          "temoii"
        ],
        "examples": [
          {
            "jp": "しゃしんを とってもいいですか。……はい、とってもいいです。",
            "meaningBn": "ছবি তুলতে পারি কি? ……হ্যাঁ, তুলতে পারেন।"
          },
          {
            "jp": "ここで たばこを すってもいいですか。……いいえ、すってはいけません、きんえんですから。",
            "meaningBn": "এখানে ধুমপান করতে পারি কি? ……না, ধুমপান করা নিষেধ, ধুমপানমুক্ত এলাকা এজন্য।"
          },
          {
            "jp": "この ペンを つかってもいいですか。",
            "meaningBn": "এই কলমটি ব্যবহার করতে পারি কি?"
          }
        ]
      },
      {
        "id": "15-2",
        "title": "〜てはいけません — Prohibition",
        "structure": "Verb て-Form + はいけません",
        "particles": [
          "te-form"
        ],
        "examples": [
          {
            "jp": "ここで しゃしんを とってはいけません。",
            "meaningBn": "এখানে ছবি তোলা নিষেধ।"
          },
          {
            "jp": "ここで たべてはいけません。",
            "meaningBn": "এখানে খাওয়া নিষেধ।"
          },
          {
            "jp": "としょかんで はなしてはいけません。",
            "meaningBn": "লাইব্রেরিতে কথা বলা নিষেধ।"
          }
        ]
      },
      {
        "id": "15-3",
        "title": "〜ています — State & Habit",
        "structure": "Verb て-Form + います",
        "particles": [
          "te-form"
        ],
        "examples": [
          {
            "jp": "わたしは にほんに すんでいます。",
            "meaningBn": "আমি জাপানে বসবাস করতেছি।"
          },
          {
            "jp": "わたしは Faysalさんを しっています。",
            "meaningBn": "আমি মি. ফয়সালকে চিনি/জানি।"
          },
          {
            "jp": "Anikさんは けっこんしています。",
            "meaningBn": "মি. অনিক বিবাহিত।"
          }
        ]
      },
      {
        "id": "15-4",
        "title": "に — はいります・すわります",
        "structure": "Noun(Place) + に + Verb",
        "particles": [
          "ni"
        ],
        "examples": [
          {
            "jp": "ここに はいってはいけません。",
            "meaningBn": "এখানে প্রবেশ করা নিষেধ।"
          },
          {
            "jp": "ここに すわってもいいですか。",
            "meaningBn": "এখানে কি বসতে পারি?"
          },
          {
            "jp": "この へやに はいらないでください。",
            "meaningBn": "এই কক্ষে প্রবেশ করবেন না।"
          }
        ]
      },
      {
        "id": "15-5",
        "title": "に…を — Put / Write at a Place",
        "structure": "Noun1 + に + Noun2 + を + Verb",
        "particles": [
          "wo",
          "ni"
        ],
        "examples": [
          {
            "jp": "ここに くるまを とめてください。",
            "meaningBn": "অনুগ্রহ করে এখানে গাড়িটি পার্ক করুন।"
          },
          {
            "jp": "ここに なまえを かいてください。",
            "meaningBn": "অনুগ্রহ করে এখানে নাম লিখুন।"
          },
          {
            "jp": "つくえの うえに ほんを おいてください。",
            "meaningBn": "ডেস্কের উপর বই রাখুন।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 16,
    "title": "Lesson 16",
    "points": [
      {
        "id": "16-1",
        "title": "て-Form Chain — Sequence of Actions",
        "structure": "Verb₁ て + Verb₂ て + Verb₃ ます",
        "particles": [
          "te-form",
          "masu-form"
        ],
        "examples": [
          {
            "jp": "わたしは ろくじに おきて、シャワーを あびて、あさごはんを たべて、かいしゃへ いきます。",
            "meaningBn": "আমি ৬টায় ঘুম থেকে উঠে, শাওয়ার করে, সকালের খাবার খেয়ে, কোম্পানিতে যাই।"
          },
          {
            "jp": "きのうの よる じゅうじに ばんごはんを たべて、テレビを みて、じゅうにじに ねました。",
            "meaningBn": "গতকাল রাত ১০টায় রাতের খাবার খেয়ে, টিভি দেখে, ১২টায় ঘুমিয়েছিলাম।"
          },
          {
            "jp": "あさ おきて、かおを あらって、はを みがきます。",
            "meaningBn": "সকালে উঠে, মুখ ধুয়ে, দাঁত মাজি।"
          }
        ]
      },
      {
        "id": "16-2",
        "title": "くて — Linking い-Adjectives",
        "structure": "い-Adj (〜い → 〜くて) + Adj",
        "particles": [
          "i-adjective"
        ],
        "examples": [
          {
            "jp": "ミラーさんの うちは おおきくて、きれいです。",
            "meaningBn": "মি. মিরার বাড়ি বড় এবং সুন্দর।"
          },
          {
            "jp": "この みせの たべものは やすくて、おいしいです。",
            "meaningBn": "এই দোকানের খাবার সস্তা এবং সুস্বাদু।"
          },
          {
            "jp": "この へやは ひろくて、あかるいです。",
            "meaningBn": "এই ঘরটি প্রশস্ত এবং উজ্জ্বল।"
          }
        ]
      },
      {
        "id": "16-3",
        "title": "で — Linking な-Adj & Nouns",
        "structure": "な-Adj / Noun + で + Adj / Noun",
        "particles": [
          "de",
          "na-adjective"
        ],
        "examples": [
          {
            "jp": "ミラーさんは ハンサムで、しんせつな ひとです。",
            "meaningBn": "মি. মিরা হ্যান্ডসাম এবং দয়ালু ব্যক্তি।"
          },
          {
            "jp": "ダッカは きれいで、しずかな まちです。",
            "meaningBn": "ঢাকা সুন্দর এবং নিরব শহর।"
          },
          {
            "jp": "さとうさんは にほんじんで、ふじだいがくの がくせいです。",
            "meaningBn": "মিস সাতো জাপানি নাগরিক এবং ফুজি বিশ্ববিদ্যালয়ের ছাত্রী।"
          }
        ]
      },
      {
        "id": "16-4",
        "title": "〜てから — \"After Doing\"",
        "structure": "Verb-て Form + から、Verb2",
        "particles": [
          "kara",
          "te-form"
        ],
        "examples": [
          {
            "jp": "あさごはんを たべてから、がっこうへ いきます。",
            "meaningBn": "সকালের খাবার খাওয়ার পর স্কুলে যাবো।"
          },
          {
            "jp": "かいぎが おわってから、うちへ かえります。",
            "meaningBn": "মিটিং শেষ হওয়ার পর বাসায় ফিরবো।"
          },
          {
            "jp": "しゅくだいを してから、あそびます。",
            "meaningBn": "বাড়ির কাজ করার পর খেলবো।"
          }
        ]
      },
      {
        "id": "16-5",
        "title": "は…が — Topic & Adjective Object",
        "structure": "Noun1/Subject + は + Noun2/Object + が + All Adjective",
        "particles": [
          "wa",
          "ga"
        ],
        "examples": [
          {
            "jp": "おおさかは たべものが おいしいです。",
            "meaningBn": "ওসাকা খাবার সুস্বাদু।"
          },
          {
            "jp": "ミラーさんは しんせつです。",
            "meaningBn": "মি. মিরা দয়ালু।"
          },
          {
            "jp": "にほんは でんしゃが べんりです。",
            "meaningBn": "জাপানে ট্রেন সুবিধাজনক।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 17,
    "title": "Lesson 17",
    "points": [
      {
        "id": "17-1",
        "title": "ない-Form — Formation",
        "structure": "Verb (ます-stem) → ない-Form",
        "particles": [
          "nai-form"
        ],
        "examples": [
          {
            "jp": "かきます → かかない",
            "meaningBn": "না লেখা (Group-1)"
          },
          {
            "jp": "たべます → たべない",
            "meaningBn": "না খাওয়া (Group-2)"
          },
          {
            "jp": "きます → こない",
            "meaningBn": "না আসা (Group-3)"
          }
        ]
      },
      {
        "id": "17-2",
        "title": "〜ないでください — \"Please Don't\"",
        "structure": "Verb ない-Form + でください",
        "particles": [
          "nai-form"
        ],
        "examples": [
          {
            "jp": "ここで しゃしんを とらないでください。",
            "meaningBn": "অনুগ্রহ করে এখানে ছবি তোলবেন না।"
          },
          {
            "jp": "わたしは げんきですから、しんぱいしないでください。",
            "meaningBn": "আমি ভালো আছি এই কারণে দুশ্চিন্তা করবেন না।"
          },
          {
            "jp": "ここで たばこを すわないでください。",
            "meaningBn": "এখানে ধুমপান করবেন না।"
          }
        ]
      },
      {
        "id": "17-3",
        "title": "〜なければなりません — \"Must\"",
        "structure": "Verb ない-Form + ければなりません",
        "particles": [
          "nai-form",
          "nakereba"
        ],
        "examples": [
          {
            "jp": "くすりを のまなければなりません。",
            "meaningBn": "ঔষধ পান না করলেই নয়।"
          },
          {
            "jp": "にほんへ いかなければなりません。",
            "meaningBn": "জাপানে না গেলেই নয়।"
          },
          {
            "jp": "しゅくだいを しなければなりません。",
            "meaningBn": "বাড়ির কাজ না করলেই নয়।"
          }
        ]
      },
      {
        "id": "17-4",
        "title": "〜なくてもいいです — \"Don't Have To\"",
        "structure": "Verb ない-Form + くてもいいです",
        "particles": [
          "nai-form",
          "temoii",
          "nakutemo"
        ],
        "examples": [
          {
            "jp": "あした こなくてもいいです。",
            "meaningBn": "আগামীকাল না আসলেও চলবে।"
          },
          {
            "jp": "あさ コーヒーを のまなくてもいいです。",
            "meaningBn": "সকালে কফি পান না করলেও চলবে।"
          },
          {
            "jp": "しんぱいしなくてもいいです。",
            "meaningBn": "দুশ্চিন্তা না করলেও চলবে।"
          }
        ]
      },
      {
        "id": "17-5",
        "title": "Object as Topic",
        "structure": "Object + は + Verb",
        "particles": [
          "object-topic"
        ],
        "examples": [
          {
            "jp": "ここに にもつを おかないでください。",
            "meaningBn": "অনুগ্রহ করে এখানে ব্যাগ রাখবেন না।"
          },
          {
            "jp": "にもつは ここに おかないでください。",
            "meaningBn": "ব্যাগটি এখানে রাখবেন না।"
          },
          {
            "jp": "この ほんは あした よみます。",
            "meaningBn": "এই বইটি আগামীকাল পড়বো।"
          }
        ]
      },
      {
        "id": "17-6",
        "title": "までに — \"By (Deadline)\"",
        "structure": "Noun(Time) + までに + Verb",
        "particles": [
          "made"
        ],
        "examples": [
          {
            "jp": "かいぎは ごじまでに おわります。",
            "meaningBn": "মিটিং ৫টার মধ্যে শেষ হবে।"
          },
          {
            "jp": "どようびまでに ほんを かえさなければなりません。",
            "meaningBn": "শনিবারের মধ্যে বই ফেরত না দিলেই নয়।"
          },
          {
            "jp": "らいしゅうまでに レポートを だしてください。",
            "meaningBn": "আগামী সপ্তাহের মধ্যে রিপোর্ট জমা দিন।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 18,
    "title": "Lesson 18",
    "points": [
      {
        "id": "18-1",
        "title": "Dictionary Form — Formation",
        "structure": "Verb (ます-stem) → Dictionary Form",
        "particles": [
          "masu-form",
          "plain-form"
        ],
        "examples": [
          {
            "jp": "かいます → かう",
            "meaningBn": "কেনা (Group-1)"
          },
          {
            "jp": "たべます → たべる",
            "meaningBn": "খাওয়া (Group-2)"
          },
          {
            "jp": "きます → くる",
            "meaningBn": "আসা (Group-3)"
          }
        ]
      },
      {
        "id": "18-2",
        "title": "〜ことができます — \"Can Do\"",
        "structure": "Verb-じしょ Form + こと + ができます / Noun + ができます",
        "particles": [
          "plain-form",
          "dekiru-koto",
          "dekimasu"
        ],
        "examples": [
          {
            "jp": "わたしは かんじが できます。",
            "meaningBn": "আমি কাঞ্জি পারি।"
          },
          {
            "jp": "わたしは かんじを かくことが できます。",
            "meaningBn": "আমি কানজি লিখতে পারি।"
          },
          {
            "jp": "わたしは にほんごで はなすことが できます。",
            "meaningBn": "আমি জাপানি ভাষা দিয়ে কথা বলতে পারি।"
          }
        ]
      },
      {
        "id": "18-3",
        "title": "しゅみは — Talking About Hobbies",
        "structure": "わたしの しゅみは + Noun / Verb-じしょForm + こと + です",
        "particles": [
          "plain-form"
        ],
        "examples": [
          {
            "jp": "わたしの しゅみは りょこうです。",
            "meaningBn": "আমার শখ ভ্রমণ।"
          },
          {
            "jp": "わたしの しゅみは りょこうを することです。",
            "meaningBn": "আমার শখ ভ্রমণ করা।"
          },
          {
            "jp": "わたしの しゅみは しゃしんを とることです。",
            "meaningBn": "আমার শখ ছবি তোলা।"
          }
        ]
      },
      {
        "id": "18-4",
        "title": "〜まえに — \"Before Doing\"",
        "structure": "Verb1-じしょForm/Noun+の/Quantifier + まえに、Verb2",
        "particles": [
          "no",
          "plain-form"
        ],
        "examples": [
          {
            "jp": "にほんへ くるまえに、にほんごを べんきょうしました。",
            "meaningBn": "জাপানে আসার পূর্বে জাপানি ভাষা পড়াশোনা করেছিলাম।"
          },
          {
            "jp": "しょくじの まえに、てを あらいます。",
            "meaningBn": "খাওয়ার পূর্বে হাত ধোব।"
          },
          {
            "jp": "たなかさんは いちじかんまえに、でかけました。",
            "meaningBn": "মি. তানাকা ১ ঘণ্টা পূর্বে বের হয়েছে।"
          }
        ]
      },
      {
        "id": "18-5",
        "title": "なかなか — \"Not Easily\"",
        "structure": "なかなか + Verb (Negative)",
        "particles": [
          "adverb-degree"
        ],
        "examples": [
          {
            "jp": "にほんでは なかなか うまを みることができません。",
            "meaningBn": "জাপানে সহজে ঘোড়া দেখতে পারা যায় না।"
          },
          {
            "jp": "しごとが なかなか おわりません。",
            "meaningBn": "কাজ সহজে শেষ হচ্ছে না।"
          },
          {
            "jp": "バスが なかなか きません。",
            "meaningBn": "বাস সহজে আসছে না।"
          }
        ]
      },
      {
        "id": "18-6",
        "title": "ぜひ — \"By All Means\"",
        "structure": "ぜひ + Verb たいです / てください / ましょう",
        "particles": [
          "adverb-degree"
        ],
        "examples": [
          {
            "jp": "ぜひ ほっかいどうへ いきたいです。",
            "meaningBn": "যেকোন উপায়ে হোক্কাইডো যেতে চাই।"
          },
          {
            "jp": "ぜひ あそびに きてください。",
            "meaningBn": "অবশ্যই বেড়াতে আসবেন।"
          },
          {
            "jp": "ぜひ いっしょに いきましょう。",
            "meaningBn": "অবশ্যই একসাথে যাই।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 19,
    "title": "Lesson 19",
    "points": [
      {
        "id": "19-1",
        "title": "た-Form — Formation",
        "structure": "Verb (ます-stem) → た-Form",
        "particles": [
          "ta-form"
        ],
        "examples": [
          {
            "jp": "よみます → よんだ",
            "meaningBn": "পড়েছিল (Group-1)"
          },
          {
            "jp": "たべます → たべた",
            "meaningBn": "খেয়েছিল (Group-2)"
          },
          {
            "jp": "します → した",
            "meaningBn": "করেছিল (Group-3)"
          }
        ]
      },
      {
        "id": "19-2",
        "title": "〜たことがあります — Experience",
        "structure": "Verb-た Form + ことがあります",
        "particles": [
          "ta-form",
          "keiken"
        ],
        "examples": [
          {
            "jp": "うまに のったことがあります。",
            "meaningBn": "ঘোড়ায় চড়ার অভিজ্ঞতা আছে।"
          },
          {
            "jp": "わたしは にほんへ いったことがあります。",
            "meaningBn": "আমার জাপানে যাওয়ার অভিজ্ঞতা আছে।"
          },
          {
            "jp": "すしを たべたことがあります。",
            "meaningBn": "সুশি খাওয়ার অভিজ্ঞতা আছে।"
          }
        ]
      },
      {
        "id": "19-3",
        "title": "〜たり〜たり — Listing Actions",
        "structure": "Verb1-た Formり + Verb2-た Formり + します",
        "particles": [
          "ta-form"
        ],
        "examples": [
          {
            "jp": "わたしは けさ ろくじに おきたり、シャワーを あびたり、あさごはんを たべたりしました。",
            "meaningBn": "আমি সকালে ৬টায় ঘুম থেকে উঠে, গোসল করে, সকালের খাবার খেয়েছি।"
          },
          {
            "jp": "こんばん べんきょうしたり、ばんごはんを たべたり、ねたりします。",
            "meaningBn": "আজ রাতে পড়াশোনা করে, রাতের খাবার খেয়ে, ঘুমাবো।"
          },
          {
            "jp": "しゅうまつは よんだり、あそんだりします。",
            "meaningBn": "সপ্তাহান্তে পড়ি বা খেলি।"
          }
        ]
      },
      {
        "id": "19-4",
        "title": "なります — \"Become\"",
        "structure": "い-Adj（い→く）/ な-Adj（な→に）/ Noun（→に）+ なります",
        "particles": [
          "ni",
          "narimasu"
        ],
        "examples": [
          {
            "jp": "さむい → さむくなります。",
            "meaningBn": "ঠান্ডা হওয়া।"
          },
          {
            "jp": "ミラーさんは げんきになりました。",
            "meaningBn": "মি. মিরা সুস্থ হয়েছে।"
          },
          {
            "jp": "わたしは にじゅうごさいに なります。",
            "meaningBn": "আমি ২৫ বছর বয়সী হবো।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 20,
    "title": "Lesson 20",
    "points": [
      {
        "id": "20-1",
        "title": "Polite & Plain Style",
        "structure": "Polite Form ↔ Plain Form",
        "particles": [
          "style"
        ],
        "examples": [
          {
            "jp": "わたしは ごはんを たべる。",
            "meaningBn": "আমি ভাত খাই। (Plain)"
          },
          {
            "jp": "わたしは ごはんを たべない。",
            "meaningBn": "আমি ভাত খাই না। (Plain)"
          },
          {
            "jp": "わたしは ごはんを たべた。",
            "meaningBn": "আমি ভাত খেয়েছিলাম। (Plain)"
          }
        ]
      },
      {
        "id": "20-2",
        "title": "Plain-Style Conversation",
        "structure": "Plain Sentence + ↗ (Rising Tone)",
        "particles": [
          "style"
        ],
        "examples": [
          {
            "jp": "コーヒーを のむ？……うん、のむ。",
            "meaningBn": "কফি পান করবি? ……হ্যাঁ, করবো।"
          },
          {
            "jp": "きょう いそがしい？……ううん、いそがしくない。",
            "meaningBn": "আজ ব্যস্ত? ……না, ব্যস্ত না।"
          },
          {
            "jp": "あした どこへ いく？……がっこうへ いく。",
            "meaningBn": "আগামীকাল কোথায় যাবি? ……স্কুলে যাবো।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 21,
    "title": "Lesson 21",
    "points": [
      {
        "id": "21-1",
        "title": "〜とおもいます — \"I Think\"",
        "structure": "All Type of Plain Form + とおもいます",
        "particles": [
          "plain-form",
          "to-omoimasu"
        ],
        "examples": [
          {
            "jp": "あした あめが ふると おもいます。",
            "meaningBn": "আগামীকাল বৃষ্টি হবে বলে মনে হয়।"
          },
          {
            "jp": "この へやは さむいと おもいます。",
            "meaningBn": "এই রুমটি ঠান্ডা হবে বলে মনে হয়।"
          },
          {
            "jp": "この パソコンは べんりだと おもいます。",
            "meaningBn": "এই কম্পিউটারটি সুবিধাজনক বলে মনে হয়।"
          }
        ]
      },
      {
        "id": "21-2",
        "title": "〜といいます — \"Say That\"",
        "structure": "Plain Form/Sentence + といいます",
        "particles": [
          "plain-form",
          "to-iimasu"
        ],
        "examples": [
          {
            "jp": "ねるまえに「おやすみなさい」といいます。",
            "meaningBn": "ঘুমানোর পূর্বে 'おやすみなさい' বলতে হয়।"
          },
          {
            "jp": "ミラーさんは「らいしゅう とうきょうへ しゅっちょうします」といいます。",
            "meaningBn": "মি. মিরা বলেছেন, আগামী সপ্তাহে টোকিওতে ব্যবসায়িক ভ্রমণে যাবো।"
          },
          {
            "jp": "ミラーさんは らいしゅう とうきょうへ しゅっちょうすると いいます。",
            "meaningBn": "মি. মিরা আগামী সপ্তাহে টোকিওতে ব্যবসায়িক ভ্রমণে যাবে বলে বলেছেন।"
          }
        ]
      },
      {
        "id": "21-3",
        "title": "〜でしょう — \"…, Right?\"",
        "structure": "Plain Form (な-Adj/Noun-এর だ বাদ) + でしょう？",
        "particles": [
          "plain-form",
          "deshou"
        ],
        "examples": [
          {
            "jp": "あした パーティーに いくでしょう？",
            "meaningBn": "আগামীকাল পার্টিতে যাবেন তাই না?"
          },
          {
            "jp": "この すしは おいしいでしょう？",
            "meaningBn": "এই সুশিটি সুস্বাদু তাই না?"
          },
          {
            "jp": "きのうは あついでしょう？",
            "meaningBn": "গতকাল গরম ছিল তাই না?"
          }
        ]
      },
      {
        "id": "21-4",
        "title": "で…があります — Events",
        "structure": "Noun1(Place) + で + Noun2 + があります",
        "particles": [
          "de"
        ],
        "examples": [
          {
            "jp": "とうきょうで にほんと ブラジルの サッカーしあいが あります。",
            "meaningBn": "টোকিওতে জাপান এবং ব্রাজিলের ফুটবল ম্যাচ অনুষ্ঠিত হবে।"
          },
          {
            "jp": "こうえんで まつりが あります。",
            "meaningBn": "পার্কে উৎসব অনুষ্ঠিত হবে।"
          },
          {
            "jp": "がっこうで コンサートが あります。",
            "meaningBn": "স্কুলে কনসার্ট অনুষ্ঠিত হবে।"
          }
        ]
      },
      {
        "id": "21-5",
        "title": "で — At an Occasion",
        "structure": "Noun(Occasion) + で",
        "particles": [
          "de"
        ],
        "examples": [
          {
            "jp": "かいぎで なにか いけんを いいましたか。",
            "meaningBn": "মিটিংয়ে কিছু মতামত দিয়েছেন কি?"
          },
          {
            "jp": "パーティーで うたを うたいました。",
            "meaningBn": "পার্টিতে গান গেয়েছিলাম।"
          },
          {
            "jp": "しあいで がんばりました。",
            "meaningBn": "খেলায় চেষ্টা করেছি।"
          }
        ]
      },
      {
        "id": "21-6",
        "title": "〜でも — \"…or Something\"",
        "structure": "Noun + でも + Verb",
        "particles": [
          "de",
          "demo"
        ],
        "examples": [
          {
            "jp": "ちょっと おちゃでも のみませんか。",
            "meaningBn": "একটু চা অন্তত পান করবেন না?"
          },
          {
            "jp": "コーヒーでも いかがですか。",
            "meaningBn": "কফি অন্তত কেমন হবে?"
          },
          {
            "jp": "テレビでも みませんか。",
            "meaningBn": "টিভি অন্তত দেখবেন না?"
          }
        ]
      },
      {
        "id": "21-7",
        "title": "〜ないと — \"Must\" (Casual)",
        "structure": "Verb ない Form → ないと…",
        "particles": [
          "nai-form"
        ],
        "examples": [
          {
            "jp": "もう かえらないと。",
            "meaningBn": "ইতিমধ্যে না ফিরলেই নয়।"
          },
          {
            "jp": "はやく いかないと。",
            "meaningBn": "তাড়াতাড়ি না গেলেই নয়।"
          },
          {
            "jp": "そろそろ べんきょうしないと。",
            "meaningBn": "এখনই পড়াশোনা না করলেই নয়।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 22,
    "title": "Lesson 22",
    "points": [
      {
        "id": "22-1",
        "title": "Noun Modification",
        "structure": "Modifier + Noun",
        "particles": [
          "noun-mod"
        ],
        "examples": [
          {
            "jp": "ミラーさんの うち",
            "meaningBn": "মি. মিরার বাড়ি।"
          },
          {
            "jp": "あたらしい うち",
            "meaningBn": "নতুন বাড়ি।"
          },
          {
            "jp": "きれいな うち",
            "meaningBn": "সুন্দর বাড়ি।"
          }
        ]
      },
      {
        "id": "22-2",
        "title": "Modifying Clauses",
        "structure": "Clause (Plain Form) + Noun",
        "particles": [
          "noun-mod"
        ],
        "examples": [
          {
            "jp": "これは ミラーさんが すんでいた うちです。",
            "meaningBn": "এটা মি. মিরার বসবাস করার ঘর।"
          },
          {
            "jp": "ミラーさんが すんでいた うちは ふるいです。",
            "meaningBn": "মি. মিরার বসবাস করা ঘরটি পুরাতন।"
          },
          {
            "jp": "ミラーさんが すんでいた うちに ねこが いました。",
            "meaningBn": "মি. মিরার বসবাস করার ঘরে বিড়াল ছিল।"
          }
        ]
      },
      {
        "id": "22-3",
        "title": "が in a Modifying Clause",
        "structure": "Subject + が + Verb (Plain) + Noun",
        "particles": [
          "ga"
        ],
        "examples": [
          {
            "jp": "これは ロヒムさんが つくった ケーキです。",
            "meaningBn": "এটা মি. রহিমের তৈরি করা কেক।"
          },
          {
            "jp": "わたしは カリナさんが かいた えが すきです。",
            "meaningBn": "আমি মিস কারিনার আঁকা ছবি পছন্দ করি।"
          },
          {
            "jp": "これは ともだちが くれた ほんです。",
            "meaningBn": "এটা বন্ধুর দেওয়া বই।"
          }
        ]
      },
      {
        "id": "22-4",
        "title": "Verb + じかん・やくそく・ようじ",
        "structure": "Verb-Dictionary Form + じかん/やくそく/ようじ",
        "particles": [
          "plain-form"
        ],
        "examples": [
          {
            "jp": "わたしは あさごはんを たべる じかんが ありません。",
            "meaningBn": "আমার সকালের খাবার খাওয়ার সময় নেই।"
          },
          {
            "jp": "わたしは ともだちと えいがを みる やくそくが あります。",
            "meaningBn": "আমার বন্ধুর সাথে মুভি দেখার প্রতিশ্রুতি আছে।"
          },
          {
            "jp": "きょうは しやくしょへ いく ようじが あります。",
            "meaningBn": "আজকে সিটি হলে গিয়ে কিছু করার আছে।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 23,
    "title": "Lesson 23",
    "points": [
      {
        "id": "23-1",
        "title": "〜とき — \"When\"",
        "structure": "Verb-Dictionary/ない Form / い-Adj / な-Adj（な）/ Noun の + とき、~",
        "particles": [
          "no",
          "nai-form",
          "toki"
        ],
        "examples": [
          {
            "jp": "わたしは にほんへ いくとき、かばんを かいました。",
            "meaningBn": "আমি জাপানে যাওয়ার সময় ব্যাগ ক্রয় করেছি।"
          },
          {
            "jp": "つかいかたが わからないとき、わたしに きいてください。",
            "meaningBn": "ব্যবহার পদ্ধতি না বোঝার সময় আমাকে জিজ্ঞাসা করবেন।"
          },
          {
            "jp": "こどもの とき、よく かわで およぎました。",
            "meaningBn": "বাচ্চা থাকার সময় (ছোট বেলায়) প্রায় নদীতে সাঁতার কাটতাম।"
          }
        ]
      },
      {
        "id": "23-2",
        "title": "〜たとき — \"When (Completed)\"",
        "structure": "Verb-た Form + とき、~",
        "particles": [
          "ta-form",
          "toki"
        ],
        "examples": [
          {
            "jp": "にほんへ いったとき、かばんを かいました。",
            "meaningBn": "জাপানে যাওয়ার পর ব্যাগ ক্রয় করেছি।"
          },
          {
            "jp": "うちへ かえったとき、あめが ふっていました。",
            "meaningBn": "বাসায় ফেরার পর বৃষ্টি হচ্ছিল।"
          },
          {
            "jp": "とうきょうに ついたとき、よるでした。",
            "meaningBn": "টোকিওতে পৌঁছানোর পর রাত ছিল।"
          }
        ]
      },
      {
        "id": "23-3",
        "title": "〜と — \"If / Whenever\" (Natural Result)",
        "structure": "Verb-Dictionary Form + と、~",
        "particles": [
          "to",
          "plain-form"
        ],
        "examples": [
          {
            "jp": "この ボタンを おすと、おつりが でます。",
            "meaningBn": "এই বোতামটি চাপলে খুচরো টাকা বের হবে।"
          },
          {
            "jp": "これを まわすと、おとが おおきくなります。",
            "meaningBn": "এটা ঘোরালে শব্দ বাড়বে।"
          },
          {
            "jp": "はるに なると、はなが さきます。",
            "meaningBn": "বসন্ত এলে ফুল ফোটে।"
          }
        ]
      },
      {
        "id": "23-4",
        "title": "を — Motion Verbs",
        "structure": "Noun + を + Motion Verb",
        "particles": [
          "wo"
        ],
        "examples": [
          {
            "jp": "こうえんを さんぽします。",
            "meaningBn": "পার্কে হাঁটাচলা করা।"
          },
          {
            "jp": "みちを わたります。",
            "meaningBn": "রাস্তা পারাপার হওয়া।"
          },
          {
            "jp": "はしを わたって、こうえんへ いきます。",
            "meaningBn": "সেতু পার হয়ে পার্কে যাবো।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 24,
    "title": "Lesson 24",
    "points": [
      {
        "id": "24-1",
        "title": "くれます — Giving To Me",
        "structure": "Giver + は + わたしに + Noun + を + くれます",
        "particles": [
          "ageru-morau-kureru"
        ],
        "examples": [
          {
            "jp": "カリナさんは わたしに はなを くれました。",
            "meaningBn": "কারিনা আমাকে ফুল দিয়েছিল।"
          },
          {
            "jp": "カリナさんは はなを くれました。",
            "meaningBn": "কারিনা আমাকে ফুল দিয়েছে।"
          },
          {
            "jp": "ともだちは わたしに ほんを くれました。",
            "meaningBn": "বন্ধু আমাকে বই দিয়েছে।"
          }
        ]
      },
      {
        "id": "24-2",
        "title": "〜てあげます・もらいます・くれます — Favors",
        "structure": "Verb-て Form + あげます/もらいます/くれます",
        "particles": [
          "te-form",
          "ageru-morau-kureru"
        ],
        "examples": [
          {
            "jp": "わたしは さとうさんに じしょを かしてあげました。",
            "meaningBn": "আমি মিস সাতোকে ডিকশনারি ধার দিয়েছি।"
          },
          {
            "jp": "わたしは ともだちに おかねを かりてもらいました。",
            "meaningBn": "আমি বন্ধু থেকে টাকা ধার করে পেয়েছি।"
          },
          {
            "jp": "せんせいは わたしに にほんごを おしえてくれました。",
            "meaningBn": "শিক্ষক আমাকে জাপানি ভাষা শিখিয়ে দিয়েছেন।"
          }
        ]
      }
    ]
  },
  {
    "lesson": 25,
    "title": "Lesson 25",
    "points": [
      {
        "id": "25-1",
        "title": "〜たら — \"If\"",
        "structure": "Plain Sentence-এর Past Form + ら、~ (If/যদি)",
        "particles": [
          "moshi-tara"
        ],
        "examples": [
          {
            "jp": "にほんへ いったら、にほんじんと けっこんします。",
            "meaningBn": "যদি জাপানে যাই তাহলে জাপানিজের সাথে বিয়ে করবো।"
          },
          {
            "jp": "じかんが なかったら、テレビを みません。",
            "meaningBn": "যদি সময় না থাকে তাহলে টিভি দেখবো না।"
          },
          {
            "jp": "やすかったら、パソコンを かいます。",
            "meaningBn": "যদি সস্তা হয় তাহলে কম্পিউটার কিনবো।"
          }
        ]
      },
      {
        "id": "25-2",
        "title": "〜たら — \"When / After\"",
        "structure": "Verb-た Form + ら、~ (When/After)",
        "particles": [
          "ta-form",
          "moshi-tara"
        ],
        "examples": [
          {
            "jp": "じゅうじに なったら、でかけましょう。",
            "meaningBn": "১০টা বাজার পর বের হবো।"
          },
          {
            "jp": "うちへ かえったら、すぐ シャワーを あびます。",
            "meaningBn": "বাসায় ফিরে সাথে সাথে গোসল করবো।"
          },
          {
            "jp": "しごとが おわったら、れんらくします。",
            "meaningBn": "কাজ শেষ হলে যোগাযোগ করবো।"
          }
        ]
      },
      {
        "id": "25-3",
        "title": "〜ても — \"Even If\"",
        "structure": "Verb-て/なくても / い-Adj（くて）/ な-Adj・Noun（で）+ も、~",
        "particles": [
          "de",
          "mo",
          "te-form",
          "nakutemo"
        ],
        "examples": [
          {
            "jp": "あめが ふっても、せんたくします。",
            "meaningBn": "বৃষ্টি হওয়া সত্ত্বেও কাপড় ধোব।"
          },
          {
            "jp": "やすくても、わたしは アイフォンを かいません。",
            "meaningBn": "সস্তা হওয়া সত্ত্বেও আমি আইফোন ক্রয় করবো না।"
          },
          {
            "jp": "にちようびでも、はたらきます。",
            "meaningBn": "রবিবার হওয়া সত্ত্বেও কাজ করবো।"
          }
        ]
      },
      {
        "id": "25-4",
        "title": "もし — \"If\"",
        "structure": "もし、~ (যদি)",
        "particles": [
          "moshi-tara"
        ],
        "examples": [
          {
            "jp": "もし おくえん あったら、いろいろな くにを りょこうしたいです。",
            "meaningBn": "যদি হানড্রেড মিলিয়ন ইয়েন থাকে তাহলে বিভিন্ন দেশে ভ্রমণ করতে চাই।"
          },
          {
            "jp": "もし じかんが あったら、てつだってください。",
            "meaningBn": "যদি সময় থাকে তাহলে সাহায্য করুন।"
          },
          {
            "jp": "もし あめが ふったら、うちに います。",
            "meaningBn": "যদি বৃষ্টি হয় তাহলে বাড়িতে থাকবো।"
          }
        ]
      }
    ]
  }
];
