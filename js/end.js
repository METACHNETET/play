// ייבוא ספריית ZIM
import zim from "https://zimjs.org/cdn/017/zim";

// יצירת מסגרת (Frame) של המשחק
const frame = new Frame("fit", 1024, 768, "#000", "#000", ready);

// פונקציה שתפעל לאחר טעינת המסגרת
function ready() {

    // יצירת אובייקט של יורה (Emitter) עם הגדרות
    const shoot = new Emitter({
        obj: new Circle(2, null, "black", 1), // אובייקט היורה, עיגול קטן
        random: { color: [blue, green, pink, yellow, orange] }, // צבעים רנדומליים
        trace: true, // שומר עקבות
        traceFadeTime: 0.5, // זמן דעיכה של העקבות
        width: W, // רוחב אזור הירי
        height: H, // גובה אזור הירי
        events: true, // הפעלת אירועים
        angle: { min: -90 - 15, max: -90 + 15 }, // זווית הירי (בתוך טווח מוגדר)
        interval: { min: 1, max: 2 }, // מרווח בין יריות
        life: 2, // זמן חיי החלקיקים
        decayStart: 1.2, // זמן התחלה של דעיכה
        decayTime: 0.05, // זמן דעיכה
        startPaused: true, // התחלה במצב מושעה
        fade: true, // הפעלת דעיכה
        gravity: 10, // כוח כבידה
        force: { min: 10, max: 13 }, // כוח הירי
        layers: "top", // שכבה עליונה
        cache: M // שמירה במטמון במובייל
    })
        .centerReg() // מיקום במרכז
        .mov(0, 300); // העברת היורה למיקום (x=0, y=300)

    // יצירת יורה נוסף באמצעות שכפול
    const shoot2 = shoot.clone().addTo(); // שכפול היורה הראשון
    timeout(1, () => { shoot2.pauseEmitter(false); }); // התחלת הירי לאחר 1 שנייה
    shoot2.on("decayed", explode); // הגדרת אירוע פיצוץ לאחר דעיכת החלקיקים
    shoot2.on("emitted", playSounds); // הפעלת סאונד בעת ירי

    // הפעלת היורה הראשון
    shoot.pauseEmitter(false);
    shoot.on("decayed", explode); // הגדרת פיצוץ לאחר דעיכה
    shoot.on("emitted", playSounds); // הפעלת סאונד בעת ירי

    // פונקציה להשמעת סאונד (ניתן להוסיף קובץ סאונד אמיתי)
    function playSounds() {
        // new Aud("streamer.mp3").play();
    }

    // פונקציה ליצירת פיצוץ
    function explode(e) {
        const explosion = e.target.explosion; // הפנייה לאובייקט הפיצוץ
        explosion.addTo(); // הוספת הפיצוץ לאזור התצוגה
        explosion.loc(e.particle); // מיקום הפיצוץ במקום החלקיק

        // הגדרת מספר חלקיקים לפיצוץ
        explosion.num = pluck(4, 6, 5, 7, 8);

        // בחירה רנדומלית של צבעים לחלקיקים
        explosion.random = pluck(
            { color: [blue, green, pink, yellow, orange] },
            { color: [blue, pink] },
            { color: [yellow, orange] },
            { color: [blue, green] },
            { color: [white] },
            { color: [blue] },
            { color: [blue, pink, yellow] }
        );

        // בחירת צורה לחלקיקים
        explosion.obj = pluck(
            new Circle(3, pink, black, 1),
            { type: "shape", s: explosion.random.color, ss: 1 }
        );

        // הפעלת הפיצוץ עם משך זמן מותאם
        explosion.spurt({
            time: () => { return 0.05 + ((H - explosion.y) - 400) / 1000; }
        });
    }

    // יצירת אובייקט בסיסי של פיצוץ
    const explosion = new Emitter({
        obj: new Circle(3, pink, black, 1).alp(1), // צורת חלקיק
        trace: true, // עקבות
        poolMin: 150, // מינימום חלקיקים במאגר
        interval: 0.01, // מרווח בין חלקיקים
        life: 1.2, // חיי חלקיק
        decayTime: 0.4, // זמן דעיכה
        decayStart: 0.4, // התחלת דעיכה
        gravity: 6, // כוח כבידה
        force: { min: 3, max: 5 }, // כוח פיצוץ
        startPaused: true, // התחלה במצב מושעה
        width: 600, // רוחב אזור הפיצוץ
        height: 700 // גובה אזור הפיצוץ
    }).centerReg();

    // קישור אובייקט הפיצוץ ליורה הראשון
    shoot.explosion = explosion;

    // שכפול הפיצוץ וקישורו ליורה השני
    const explosion2 = explosion.clone().centerReg();
    shoot2.explosion = explosion2;
}
