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

The artwork list can be modified by editing the `list.xlsx` file.

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

---

## Excel Data Format

The first row of `list.xlsx` is used as the header row.  
Actual artwork data starts from the second row.

Example:

| A | B | C | D | F | G | H |
|---|---|---|---|---|---|---|
| Name of the artwork | Artist name | Artist pen name / Ho | This is the description of the artwork. | 제 103회 | 녹음방초 | 녹음방초에 초대합니다. |

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
- Artwork images should be saved inside the `src` folder.
- Image files should be saved as `.jpg`.
- If an image is missing, the website will show `이미지 준비 중`.
- If artwork data is changed, refresh the browser to check the updated result.
- If the Excel file does not load, check whether the website is opened through a local server.

---

## Technologies Used

- HTML
- CSS
- JavaScript
- Tailwind CSS
- SheetJS
- Excel file data loading

---

## Author

Dankook Calligraphy Club
