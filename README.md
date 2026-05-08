# The_103rd_exhibition_of_art

This is a website for the 103rd exhibition of Dankook Calligraphy Club.

The website introduces the exhibition and displays the list of artworks.  
Visitors can click each artwork to view its image and description.

This website will be closed after the exhibition ends.

---

## Project Description

This project was created for the 103rd exhibition of Dankook Calligraphy Club.

The website includes:

- Exhibition poster
- Exhibition information
- Artwork list
- Artwork detail popup
- Notice popup
- Excel-based artwork data management

The artwork list and some website text can be modified by editing the `list.xlsx` file.

---

## File Structure

```txt
The_103rd_exhibition_of_art/
├─ src/
│  ├─ poster.png
│  ├─ 0.jpg
│  ├─ 1.jpg
│  ├─ 2.jpg
│  └─ ...
├─ index.html
├─ list.xlsx
├─ README.md
├─ script.js
└─ style.css
```

---

## How to Run

There are two ways to run this website.

---

### 1. Run Locally

Because this website reads data from an Excel file, it should be opened through a local server.

Run the following command in the project folder:

```bash
py -m http.server 8000
```

Then open this address in your browser:

```txt
http://localhost:8000
```

---

### 2. Publish with GitHub Pages

This website can also be published using GitHub Pages.

First, push the project files to GitHub.

```bash
git add .
git commit -m "Update exhibition website"
git push origin main
```

Then open the repository on GitHub and follow these steps:

```txt
Settings → Pages → Build and deployment → Source → Deploy from a branch
```

Set the branch and folder like this:

```txt
Branch: main
Folder: /root
```

Then click `Save`.

After GitHub Pages finishes deployment, the website URL will usually look like this:

```txt
https://your-github-username.github.io/The_103rd_exhibition_of_art/
```

If the website does not appear immediately, wait a moment and refresh the page.

---

## How to Update Artwork Data

You can update the artwork information by editing the `list.xlsx` file.

The Excel file uses the following columns:

| Column | Description |
|---|---|
| A | Name of the artwork |
| B | Artist name |
| C | Artist pen name / Ho |
| D | Artwork description |
| F | Exhibition round |
| G | Exhibition name |
| H | Exhibition message |
| I | Exhibition schedule |
| J | Exhibition venue |
| K | Review meeting information |

---

## Excel Data Format

The first row of `list.xlsx` is used as the header row.  
Actual artwork data starts from the second row.

Example:

| A | B | C | D | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|
| Name of the artwork | Artist name | Artist pen name / Ho | This is the description of the artwork. | 제 103회 | 녹음방초 | 녹음방초에 초대합니다. | 2026.05.07 — 05.09 | 단국대학교 혜당관 2층 로비 | 5월 9일 토요일 16:00 |

The website reads the values from `list.xlsx` and applies them to the page title, main title, popup title, popup message, schedule, venue, and review meeting information.

---

## Poster File Rule

The exhibition poster should be placed inside the `src` folder.

The poster file must be named:

```txt
src/poster.png
```

Do not change the poster file name unless you also update the image path in `index.html`.

Correct example:

```txt
src/poster.png
```

Incorrect examples:

```txt
src/poster.jpg
src/poster_103.png
poster.png
```

The poster image is displayed at the top of the website.

---

## Image File Rule

Artwork images should be placed inside the `src` folder.

The image file names must match the artwork order in `list.xlsx`.

```txt
First artwork  → src/0.jpg
Second artwork → src/1.jpg
Third artwork  → src/2.jpg
```

For example, if the first row of artwork data in `list.xlsx` is `토마토`, its image file should be:

```txt
src/0.jpg
```

If the second row is `國士無雙`, its image file should be:

```txt
src/1.jpg
```

---

## About ID

The `id` is not written directly in `list.xlsx`.

Instead, the website automatically creates an `id` based on the row order of the artwork data.

For example:

| Artwork order in `list.xlsx` | Automatically created id | Image file name |
|---|---|---|
| First artwork | 0 | `src/0.jpg` |
| Second artwork | 1 | `src/1.jpg` |
| Third artwork | 2 | `src/2.jpg` |

So, when you add or update images, make sure the image file names match the artwork order in `list.xlsx`.

---

## Important Notes

- Do not change the file name `list.xlsx`.
- Do not change the folder name `src`.
- `script.js` and `style.css` are located in the project root folder.
- The poster image must be saved as `src/poster.png`.
- Artwork images should be saved inside the `src` folder.
- Artwork image files should be saved as `.jpg`.
- If an artwork image is missing, the website will show `이미지 준비 중`.
- If artwork data is changed, refresh the browser to check the updated result.
- If the Excel file does not load, check whether the website is opened through a local server.
- Do not commit temporary Excel files such as `~$list.xlsx`.

---

## Technologies Used

- HTML
- CSS
- JavaScript
- Tailwind CSS
- SheetJS
- Excel file data loading