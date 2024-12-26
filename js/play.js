import zim from "https://zimjs.org/cdn/017/zim";

// מערך נכסי התמונות לאובייקטים
const assets = [
    "../assets/image1.jpg",
    "../assets/image2.jpg",
    "../assets/image3.jpg",
    "../assets/image4.jpg",
    "../assets/image5.jpg",
    "../assets/image6.jpg",
    "../assets/image7.jpg",
    "../assets/image8.jpg",
    "../assets/image9.jpg",
    "../assets/target1.jpg",
    "../assets/target2.jpg",
    "../assets/target3.jpg",
    "../assets/target4.jpg",
    "../assets/target5.jpg",
    "../assets/target6.jpg",
    "../assets/target7.jpg",
    "../assets/target8.jpg",
    "../assets/target9.jpg",
];

// יצירת מסגרת (Frame) של המשחק
const frame = new Frame("fit", 1024, 768, "#000", "#000", ready, assets, "../assets/");

function ready() {
    // הגדרת סגנונות ברירת מחדל
    STYLE = {
        borderColor: dark,
        borderWidth: 3,
        reg: CENTER,
    };

    let currentRound = 1; // סיבוב נוכחי

    function setupRound(round) {
        const startIndex = (round - 1) * 3; // חישוב האינדקס ההתחלתי של התמונות לסיבוב

        // יצירת רשימת האובייקטים לסיבוב
        const objectsList = assets.slice(startIndex, startIndex + 3).map((asset) => {
            const obj = new Bitmap(frame.asset(asset)).sca(0.3); // יצירת אובייקט Bitmap עם סקייל קטן
            if (obj.width === 0 || obj.height === 0) {
                console.error(`Image ${asset} failed to load.`); // טיפול במקרה שתמונה לא נטענה
            }
            return obj;
        });

        // יצירת רשימת המטרות לסיבוב
        const targetsList = assets.slice(startIndex + 9, startIndex + 12).map((asset) => {
            const target = new Bitmap(frame.asset(asset)).sca(0.3);
            if (target.width === 0 || target.height === 0) {
                console.error(`Target ${asset} failed to load.`);
            }
            return target;
        });

        // חיבור כל אובייקט עם מטרה מתאימה
        loop(objectsList, (obj, i) => {
            obj.match = targetsList[i];
        });

        shuffle(targetsList, true); // ערבוב רשימת המטרות

        // יצירת טבלה להצגת המטרות
        let targets = new Tile(targetsList, 3, 1, 150, 0, true)
            .pos(0, 200, CENTER)
            .alp(0)
            .animate({
                wait: 0.5,
                props: { alpha: 1 }, // העלאת שקיפות ל-100%
            });

        // יצירת טבלה לגרירת האובייקטים
        const objects = new Tile(objectsList, 3, 1, 150, 0, true)
            .drag()
            .pos(0, 150, CENTER, BOTTOM);

        // שמירת מיקום התחלתי לכל אובייקט
        objects.loop((obj) => {
            obj.startX = obj.x;
            obj.startY = obj.y;
        });

        // יצירת צורה שתתאר את הקו בין האובייקט לגרירה
        const shape = new Shape().addTo().ord(-1);
        let currentShape;

        // טיפול באירוע התחלת גרירה
        objects.on("mousedown", (e) => {
            currentShape = e.target; // שמירת האובייקט הנבחר
            objects.loop((obj) => {
                if (obj != currentShape) obj.noMouse(); // מניעת אפשרות לגרור אובייקטים נוספים
            });
        });

        // יצירת הקו המחבר בין הנקודה ההתחלתית למיקום הנוכחי
        Ticker.add(() => {
            if (currentShape) {
                let obj = currentShape;
                let point1 = obj.parent.localToGlobal(obj.startX, obj.startY);
                let point2 = obj.parent.localToGlobal(obj.x, obj.y);
                shape.c().s(red).ss(4).mt(point1.x, point1.y).lt(point2.x, point2.y);
            }
        });

        // טיפול באירוע שחרור האובייקט
        objects.on("pressup", (e) => {
            objects.loop((obj) => {
                obj.mouse(); // החזרת אפשרות לגרור אובייקטים
            });
            let obj = e.target;
            if (obj.hitTestBounds(obj.match)) {
                obj.loc(obj.match).noMouse(); // מיקום האובייקט על המטרה
                obj.match.removeFrom(); // הסרת המטרה מהמסך

                // יצירת אפקט זיקוקים
                const firework = new Emitter({
                    obj: new Circle(5, [yellow, red, orange], null, 0.5), // זיקוקים צבעוניים
                    interval: 0.02,
                    life: 0.5,
                    decayTime: 0.4,
                    force: { min: 2, max: 4 },
                    num: 15, // מספר הזיקוקים
                    startPaused: false,
                });
                firework.loc(obj).spurt(15);

                shape.c(); // ניקוי הקו המחבר
                currentShape = null;

                if (targets.numChildren == 0) { // בדיקת סיום הסיבוב
                    objects.animate({
                        props: { scale: 1.5 },
                        time: 0.2,
                        rewind: true,
                        loopCount: 2,
                        sequence: 0.1,
                    });
                    if (currentRound < 3) { // מעבר לסיבוב הבא
                        currentRound++;
                        setupRound(currentRound);
                    } else {
                        console.log("Game Over");
                        window.location.href = "end.html"; // מעבר לדף סיום
                    }
                }
            } else {
                objects.noMouse(); // מניעת גרירה זמנית
                obj.animate({
                    props: { x: obj.startX, y: obj.startY },
                    time: 0.5,
                    ease: "elasticOut",
                    call: () => {
                        objects.mouse(); // החזרת אפשרות לגרירה
                        currentShape = null;
                    },
                });
            }
        });
    }

    setupRound(currentRound); // התחלת הסיבוב הראשון
}
