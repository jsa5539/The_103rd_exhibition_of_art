const EXCEL_FILE_PATH = './list.xlsx';
const EXHIBITION_LABEL = '단국서예작품전';

const DEFAULT_SITE_TEXT = {
    round: '제 103회',
    exhibitionName: '녹음방초',
    invitationMessage: '녹음방초(綠陰芳草)에 초대합니다.',
    noticeText: '리플렛에 오탈자가 존재합니다.\n사이트를 참고하여 감상해 주세요.',
    scheduleText: '2026.05.07 — 05.09',
    venueText: '단국대학교 혜당관 2층 로비',
    reviewText: '5월 9일 (토요일) 16:00',
    viewingNote: '※ 전시 관람 시간은 학교 운영 시간에 준합니다.',
    parkingHeading: '🅿️ 주차 안내',
    parkingStatus: '주차 관련 정보는 현재 확인 중입니다.',
    parkingNote: '결정되는 대로 공지하겠습니다.',
    loadingText: '작품 목록을 불러오는 중입니다...',
    loadErrorText: '작품 목록을 불러오지 못했습니다. list.xlsx 파일 위치를 확인해 주세요.',
    copyrightText: '2026 Dankook Calligraphy Club. All rights reserved.'
};

const DEFAULT_WORK_DESCRIPTION = '등록된 작품 설명이 없습니다.';
const EXHIBITION_KEYWORD_MAP = {
    round: ['회차'],
    exhibitionName: ['이름', '제목', '전시명'],
    invitationMessage: ['한마디', '초대', '문구', '소개'],
    scheduleText: ['일정', '기간'],
    venueText: ['장소', '위치'],
    reviewText: ['품평'],
    viewingNote: ['관람'],
    noticeText: ['공지', '안내'],
    parkingHeading: ['주차 제목'],
    parkingStatus: ['주차 내용'],
    parkingNote: ['주차 비고']
};
const EXHIBITION_POSITION_MAP = {
    5: 'round',
    6: 'exhibitionName',
    7: 'invitationMessage',
    8: 'scheduleText',
    9: 'venueText',
    10: 'noticeText'
};

const elements = {
    grid: document.getElementById('gallery-grid'),
    noticePopup: document.getElementById('notice-popup'),
    noticePopupBox: document.getElementById('notice-popup-box'),
    noticeCloseBtn: document.getElementById('notice-close-btn'),
    modal: document.getElementById('modal'),
    modalBox: document.getElementById('modal-box'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalTitle: document.getElementById('modal-title'),
    modalArtist: document.getElementById('modal-artist'),
    modalDesc: document.getElementById('modal-desc'),
    modalImageTag: document.getElementById('modal-image-tag'),
    modalImagePlaceholder: document.getElementById('modal-image-placeholder'),
    posterImage: document.getElementById('poster-image'),
    mainTitle: document.getElementById('main-title'),
    mainSubtitle: document.getElementById('main-subtitle'),
    popupTitle: document.getElementById('popup-title'),
    popupSubtitle: document.getElementById('popup-subtitle'),
    popupNoticeText: document.getElementById('popup-notice-text'),
    scheduleText: document.getElementById('schedule-text'),
    venueText: document.getElementById('venue-text'),
    footerVenueText: document.getElementById('footer-venue-text'),
    reviewText: document.getElementById('review-text'),
    viewingNote: document.getElementById('viewing-note'),
    parkingHeading: document.getElementById('parking-heading'),
    parkingStatus: document.getElementById('parking-status'),
    parkingNote: document.getElementById('parking-note'),
    loadingText: document.getElementById('gallery-loading-text'),
    copyrightText: document.getElementById('copyright-text')
};

document.addEventListener('DOMContentLoaded', () => {
    setPageScrollLocked(true);
    setupPopupControls();
    applySiteText(DEFAULT_SITE_TEXT);
    void loadExcelData();
});

function setPageScrollLocked(isLocked) {
    document.body.style.overflow = isLocked ? 'hidden' : 'auto';
}

function closeNoticePopup() {
    elements.noticePopup.classList.add('hidden');
    setPageScrollLocked(false);
}

function closeModal() {
    elements.modal.classList.add('hidden');
    setPageScrollLocked(false);
}

async function loadExcelData() {
    try {
        const response = await fetch(EXCEL_FILE_PATH);

        if (!response.ok) {
            throw new Error('엑셀 파일을 불러오지 못했습니다.');
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: ''
        });

        const exhibitionInfo = getExhibitionInfo(rows);
        applySiteText(exhibitionInfo);
        renderGallery(getWorkData(rows));
    } catch (error) {
        console.error(error);
        elements.grid.innerHTML = `
            <p class="text-red-500 text-sm">
                ${escapeHTML(DEFAULT_SITE_TEXT.loadErrorText)}
            </p>
        `;
    }
}

function getExhibitionInfo(rows) {
    const info = { ...DEFAULT_SITE_TEXT };
    const headerRow = rows[0] || [];
    const dataRows = [rows[1] || [], rows[2] || []];

    for (let colIndex = 5; colIndex <= 10; colIndex += 1) {
        const header = String(headerRow[colIndex] || '').trim();
        const value = pickFirstFilledValue(dataRows, colIndex);

        if (!value) {
            continue;
        }

        const matchedKey = resolveExhibitionKey(header, colIndex);
        if (matchedKey) {
            info[matchedKey] = value;
        }
    }

    return info;
}

function resolveExhibitionKey(header, colIndex) {
    if (header) {
        const matchedEntry = Object.entries(EXHIBITION_KEYWORD_MAP).find(([, keywords]) =>
            keywords.some(keyword => header.includes(keyword))
        );

        if (matchedEntry) {
            return matchedEntry[0];
        }
    }

    return EXHIBITION_POSITION_MAP[colIndex] || null;
}

function pickFirstFilledValue(rows, colIndex) {
    for (const row of rows) {
        const value = String(row[colIndex] || '').trim();
        if (value) {
            return value;
        }
    }

    return '';
}

function getWorkData(rows) {
    return rows
        .slice(1)
        .filter(row => row[0] || row[1])
        .map((row, index) => ({
            id: index,
            title: row[0] || '작품명 없음',
            artist: row[1] || '이름 없음',
            note: row[2] || '',
            desc: row[3] || DEFAULT_WORK_DESCRIPTION
        }));
}

function applySiteText(info) {
    const mergedInfo = { ...DEFAULT_SITE_TEXT, ...info };
    const exhibitionTitle = `${mergedInfo.round} ${EXHIBITION_LABEL}`;

    document.title = `${exhibitionTitle} : ${mergedInfo.exhibitionName}`;
    elements.mainTitle.innerText = exhibitionTitle;
    elements.mainSubtitle.innerText = `"${mergedInfo.exhibitionName}"`;
    elements.popupTitle.innerHTML = `${escapeHTML(mergedInfo.round)}<br>${EXHIBITION_LABEL}`;
    elements.popupSubtitle.innerText = mergedInfo.invitationMessage;
    elements.popupNoticeText.innerHTML = escapeHTML(mergedInfo.noticeText).replaceAll('\n', '<br>');
    elements.scheduleText.innerText = mergedInfo.scheduleText;
    elements.venueText.innerText = mergedInfo.venueText;
    elements.footerVenueText.innerText = mergedInfo.venueText;
    elements.reviewText.innerText = mergedInfo.reviewText;
    elements.viewingNote.innerText = mergedInfo.viewingNote;
    elements.parkingHeading.innerText = mergedInfo.parkingHeading;
    elements.parkingStatus.innerText = mergedInfo.parkingStatus;
    elements.parkingNote.innerText = mergedInfo.parkingNote;
    elements.loadingText.innerText = mergedInfo.loadingText;
    elements.copyrightText.innerText = mergedInfo.copyrightText;
    elements.posterImage.alt = `${mergedInfo.exhibitionName} 포스터`;
}

function renderGallery(workData) {
    elements.grid.innerHTML = '';

    workData.forEach(work => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-100 group cursor-pointer';
        card.addEventListener('click', () => {
            openModal(work);
        });

        card.innerHTML = `
            <div class="p-8 text-center">
                <span class="text-[10px] tracking-widest text-[#7D7268] uppercase mb-2 block opacity-60">
                    ${escapeHTML(work.note) || '&nbsp;'}
                </span>

                <h3 class="font-serif text-2xl mb-4 group-hover:text-[#603a00] transition-colors leading-tight">
                    ${escapeHTML(work.title)}
                </h3>

                <div class="w-8 h-[1px] bg-gray-200 mx-auto mb-4"></div>

                <div class="text-sm text-gray-500">
                    <span>${escapeHTML(work.artist)}</span>
                </div>
            </div>
        `;

        elements.grid.appendChild(card);
    });
}

function openModal(work) {
    elements.modalTitle.innerText = work.title;
    elements.modalArtist.innerText = work.note ? `${work.note} ${work.artist}` : work.artist;
    elements.modalDesc.innerText = work.desc || DEFAULT_WORK_DESCRIPTION;

    const imagePath = `src/${work.id}.jpg`;
    elements.modalImageTag.classList.add('hidden');
    elements.modalImagePlaceholder.classList.remove('hidden');
    elements.modalImageTag.src = imagePath;
    elements.modalImageTag.alt = work.title;

    elements.modalImageTag.onload = () => {
        elements.modalImageTag.classList.remove('hidden');
        elements.modalImagePlaceholder.classList.add('hidden');
    };

    elements.modalImageTag.onerror = () => {
        elements.modalImageTag.classList.add('hidden');
        elements.modalImagePlaceholder.classList.remove('hidden');
    };

    elements.modal.classList.remove('hidden');
    setPageScrollLocked(true);
}

function setupPopupControls() {
    elements.noticePopup.addEventListener('click', closeNoticePopup);
    elements.noticePopupBox.addEventListener('click', event => {
        event.stopPropagation();
    });
    elements.noticeCloseBtn.addEventListener('click', event => {
        event.stopPropagation();
        closeNoticePopup();
    });
    elements.modal.addEventListener('click', closeModal);
    elements.modalBox.addEventListener('click', event => {
        event.stopPropagation();
    });
    elements.modalCloseBtn.addEventListener('click', event => {
        event.stopPropagation();
        closeModal();
    });
}

function escapeHTML(text) {
    return String(text)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
