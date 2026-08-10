# 🚀 Vercel Deployment Complete Process (सोपी मराठी व इंग्रजी स्टेप-बाय-स्टेप माहिती)

ही Vercel वर तुमची **Nashik's Best Misal** वेबसाईट यशस्वीपणे होस्ट करण्याची अचूक पद्धत आहे.

---

## 📌 स्टेप १: GitHub वर कोड पुश करा (VS Code Terminal)

VS Code मधील टर्मिनल उघडा आणि खालील ३ कमांड्स रन करा:
```bash
git add .
git commit -m "Final Vercel deployment update"
git push origin main
```

---

## 📌 स्टेप २: Vercel वर प्रोजेक्ट इम्पोर्ट करा

1. तुमच्या ब्राऊझरमध्ये **[https://vercel.com/dashboard](https://vercel.com/dashboard)** उघडा.
2. वर उजव्या बाजूला **"Add New..."** बटनावर क्लिक करा आणि **"Project"** निवडा.
3. **Import Git Repository** खाली तुमचे GitHub Repository **`Tejas143220/nashik-top-misal`** निवडा आणि **Import** वर क्लिक करा.

---

## 📌 स्टेप ३: Vercel Settings सेट करा (अत्यंत महत्वाचे ⚠️)

Vercel च्या सेटिंग्स पेजवर खालीलप्रमाणे माहिती भरा:

| सेटिंग्सचे नाव (Field) | काय सेट करायचे? (Exact Value) | महत्वाची टीप |
| :--- | :--- | :--- |
| **Framework Preset** | `Vite` | Vercel आपोआप डिटेक्ट करेल |
| ⚠️ **Root Directory** | **`frontend`** | **Edit वर क्लिक करून `frontend` फोल्डर निवडा** |
| **Build Command** | `npm run build` | डिफॉルト बिल्ड कमांड |
| **Output Directory** | `dist` | डिफॉल्ट आऊटपुट |
| **Install Command** | `npm install` | डिफॉल्ट इन्स्टॉल |

---

## 📌 STEP ४: Environment Variable टाका (Backend जोडण्यासाठी)

**Environment Variables** नावाच्या सेक्शनवर क्लिक करून खालीलप्रमाणे **Key** आणि **Value** टाका:

- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://nashik-top-misal-backend.onrender.com/api/v1`

*(जर तुमचे Render Backend URL वेगळे असेल तर ते येथे टाका).*

---

## 📌 स्टेप ५: "Deploy" बटनावर क्लिक करा 🚀

1. खाली **"Deploy"** बटनावर क्लिक करा.
2. Vercel फक्त २५ ते ३० सेकंदात तुमची साईट तयार करेल.
3. तुम्हाला तुमची **Live Website URL** मिळेल:  
   👉 **`https://nashik-top-misal.vercel.app`**

---

## ⚙️ तुमच्या साईटवर कधीही Error का येणार नाही?

1. **`frontend/vercel.json`**: यामध्ये SPA Rewrites सेट केले आहेत, त्यामुळे कोणताही पेज रिफ्रेश केला तरी 404 किंवा ब्लँक स्क्रीन येणार नाही.
2. **`ErrorBoundary.jsx`**: जर बॅकएंड कधी बंद असेल, तरीही वेबसाईट क्रॅश होणार नाही आणि सुंदर बॅकअप डेटा दिसेल.
