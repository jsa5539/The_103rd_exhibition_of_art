// 읽어올 엑셀 파일 경로
// 현재 script.js 기준이 아니라, index.html이 실행되는 위치 기준으로 경로가 잡힘
const EXCEL_FILE_PATH = './list.xlsx';

// 작품전 공통 이름
// 예: 제 103회 단국서예작품전
const EXHIBITION_NAME = '단국서예작품전';

// 엑셀에서 작품전 정보가 비어 있을 때 대신 사용할 기본값
const DEFAULT_EXHIBITION_INFO = {
    round: '제 #회',
    name: '작품전 이름',
    message: '작품 한마디를 입력해 주세요'
};

// 작품 설명이 비어 있을 때 대신 보여줄 기본 문구
const DEFAULT_WORK_DESCRIPTION = '등록된 작품 설명이 없습니다.';


// HTML에서 자주 사용할 요소들을 미리 가져와서 객체로 정리
// 이렇게 해두면 document.getElementById(...)를 여러 번 반복하지 않아도 됨
const elements = {
    // 작품 카드들이 들어갈 영역
    grid: document.getElementById('gallery-grid'),

    // 처음 뜨는 안내 팝업 관련 요소
    noticePopup: document.getElementById('notice-popup'),
    noticePopupBox: document.getElementById('notice-popup-box'),
    noticeCloseBtn: document.getElementById('notice-close-btn'),

    // 작품 상세 모달 관련 요소
    modal: document.getElementById('modal'),
    modalBox: document.getElementById('modal-box'),
    modalCloseBtn: document.getElementById('modal-close-btn'),

    // 작품 상세 모달 안에 표시될 내용
    modalTitle: document.getElementById('modal-title'),
    modalArtist: document.getElementById('modal-artist'),
    modalDesc: document.getElementById('modal-desc'),
    modalImageTag: document.getElementById('modal-image-tag'),
    modalImagePlaceholder: document.getElementById('modal-image-placeholder'),

    // 메인 화면과 팝업의 제목 영역
    mainTitle: document.getElementById('main-title'),
    mainSubtitle: document.getElementById('main-subtitle'),
    popupTitle: document.getElementById('popup-title'),
    popupSubtitle: document.getElementById('popup-subtitle')
};


// HTML 문서가 전부 로드된 뒤 실행되는 부분
document.addEventListener('DOMContentLoaded', () => {
    // 처음 안내 팝업이 떠 있는 동안 배경 스크롤을 막음
    setPageScrollLocked(true);

    // 팝업과 모달의 클릭 이벤트 설정
    setupPopupControls();

    // 엑셀 파일을 읽어서 화면에 작품 목록을 표시
    // void는 비동기 함수의 반환값을 따로 사용하지 않겠다는 의미
    void loadExcelData();
});


// 페이지 스크롤을 잠그거나 푸는 함수
function setPageScrollLocked(isLocked) {
    document.body.style.overflow = isLocked ? 'hidden' : 'auto';
}


// 처음 안내 팝업을 닫는 함수
function closeNoticePopup() {
    elements.noticePopup.classList.add('hidden');
    setPageScrollLocked(false);
}


// 작품 상세 모달을 닫는 함수
function closeModal() {
    elements.modal.classList.add('hidden');
    setPageScrollLocked(false);
}


// 엑셀 파일을 불러와서 작품전 정보와 작품 목록을 화면에 반영하는 함수
async function loadExcelData() {
    try {
        // 지정한 경로에서 엑셀 파일을 가져옴
        const response = await fetch(EXCEL_FILE_PATH);

        // 파일을 제대로 불러오지 못한 경우 에러 발생
        if (!response.ok) {
            throw new Error('엑셀 파일을 불러오지 못했습니다.');
        }

        // 엑셀 파일을 ArrayBuffer 형태로 변환
        const arrayBuffer = await response.arrayBuffer();

        // SheetJS 라이브러리로 엑셀 파일 읽기
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        // 첫 번째 시트를 사용
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // 시트 내용을 2차원 배열 형태로 변환
        // header: 1 → 첫 줄도 일반 배열로 가져옴
        // defval: '' → 빈 셀은 빈 문자열로 처리
        const rows = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: ''
        });

        // 엑셀에서 작품전 정보를 읽어와 제목 영역 업데이트
        updateExhibitionText(getExhibitionInfo(rows));

        // 엑셀에서 작품 목록을 읽어와 갤러리 카드 생성
        renderGallery(getWorkData(rows));

    } catch (error) {
        // 에러 내용을 개발자 도구 콘솔에 출력
        console.error(error);

        // 화면에도 사용자에게 에러 메시지를 보여줌
        elements.grid.innerHTML = `
            <p class="text-red-500 text-sm">
                작품 목록을 불러오지 못했습니다. list.xlsx 파일 위치를 확인해 주세요.
            </p>
        `;
    }
}


// 엑셀에서 작품전 정보를 가져오는 함수
function getExhibitionInfo(rows) {
    // 첫 번째 줄은 제목 행이라고 보고, 두 번째 줄의 데이터를 사용
    const firstDataRow = rows[1] || [];

    return {
        // F열: 작품전 회차
        round: firstDataRow[5] || DEFAULT_EXHIBITION_INFO.round,

        // G열: 작품전 이름
        name: firstDataRow[6] || DEFAULT_EXHIBITION_INFO.name,

        // H열: 작품전 한마디
        message: firstDataRow[7] || DEFAULT_EXHIBITION_INFO.message
    };
}


// 엑셀에서 작품 목록 데이터를 가져오는 함수
function getWorkData(rows) {
    return rows
        // 첫 번째 줄은 제목 행이므로 제외
        .slice(1)

        // 작품명 또는 이름이 있는 행만 사용
        .filter(row => row[0] || row[1])

        // 각 행을 작품 데이터 객체 형태로 변환
        .map((row, index) => ({
            // 작품 순서 번호
            // 이 번호가 이미지 파일명과 연결됨
            // 예: id가 0이면 src/0.jpg
            id: index,

            // A열: 작품명
            title: row[0] || '작품명 없음',

            // B열: 작가 이름
            artist: row[1] || '이름 없음',

            // C열: 호
            note: row[2] || '',

            // D열: 작품 설명
            desc: row[3] || DEFAULT_WORK_DESCRIPTION
        }));
}


// 작품전 제목, 팝업 제목 등을 엑셀 내용에 맞게 바꾸는 함수
function updateExhibitionText(info) {
    // 브라우저 탭 제목 변경
    document.title = `${info.round} ${EXHIBITION_NAME} : ${info.name}`;

    // 메인 화면 제목 변경
    elements.mainTitle.innerText = `${info.round} ${EXHIBITION_NAME}`;

    // 메인 화면 부제목 변경
    elements.mainSubtitle.innerText = `"${info.name}"`;

    // 팝업 제목 변경
    // <br> 태그를 사용해야 하므로 innerHTML 사용
    elements.popupTitle.innerHTML = `${escapeHTML(info.round)}<br>${EXHIBITION_NAME}`;

    // 팝업 한마디 변경
    elements.popupSubtitle.innerText = info.message;
}


// 작품 목록 카드를 화면에 생성하는 함수
function renderGallery(workData) {
    // 기존에 있던 로딩 문구나 카드 내용을 모두 비움
    elements.grid.innerHTML = '';

    // 작품 데이터 개수만큼 카드를 생성
    workData.forEach(work => {
        const card = document.createElement('div');

        // 카드 디자인 클래스
        card.className = 'bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-100 group cursor-pointer';

        // 카드를 클릭하면 작품 상세 모달 열기
        card.addEventListener('click', () => {
            openModal(work);
        });

        // 카드 안에 들어갈 HTML 내용
        // escapeHTML을 사용해서 엑셀 내용에 특수문자가 있어도 안전하게 표시
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

        // 완성된 카드를 갤러리 영역에 추가
        elements.grid.appendChild(card);
    });
}


// 작품 카드를 클릭했을 때 상세 모달을 여는 함수
function openModal(work) {
    // 모달에 작품명 표시
    elements.modalTitle.innerText = work.title;

    // 호가 있으면 호 + 이름, 없으면 이름만 표시
    elements.modalArtist.innerText = work.note ? `${work.note} ${work.artist}` : work.artist;

    // 작품 설명 표시
    elements.modalDesc.innerText = work.desc || DEFAULT_WORK_DESCRIPTION;

    // 작품 이미지 경로 설정
    // 작품 id에 따라 src/0.jpg, src/1.jpg 형식으로 불러옴
    const imagePath = `src/${work.id}.jpg`;

    // 이미지를 새로 불러오기 전에는 일단 숨기고 placeholder를 보여줌
    elements.modalImageTag.classList.add('hidden');
    elements.modalImagePlaceholder.classList.remove('hidden');

    // 이미지 주소와 대체 텍스트 설정
    elements.modalImageTag.src = imagePath;
    elements.modalImageTag.alt = work.title;

    // 이미지가 정상적으로 불러와졌을 때 실행
    elements.modalImageTag.onload = () => {
        elements.modalImageTag.classList.remove('hidden');
        elements.modalImagePlaceholder.classList.add('hidden');
    };

    // 이미지 파일이 없거나 경로가 잘못되었을 때 실행
    elements.modalImageTag.onerror = () => {
        elements.modalImageTag.classList.add('hidden');
        elements.modalImagePlaceholder.classList.remove('hidden');
    };

    // 모달을 화면에 보여줌
    elements.modal.classList.remove('hidden');

    // 모달이 열린 동안 배경 스크롤 방지
    setPageScrollLocked(true);
}


// 처음 안내 팝업과 작품 상세 모달의 클릭 이벤트를 설정하는 함수
function setupPopupControls() {
    // 안내 팝업의 검은 배경을 클릭하면 팝업 닫기
    elements.noticePopup.addEventListener('click', closeNoticePopup);

    // 안내 팝업 내부 박스를 클릭했을 때는 닫히지 않게 막음
    elements.noticePopupBox.addEventListener('click', event => {
        event.stopPropagation();
    });

    // 안내 팝업 X 버튼 클릭 시 팝업 닫기
    elements.noticeCloseBtn.addEventListener('click', event => {
        event.stopPropagation();
        closeNoticePopup();
    });

    // 작품 상세 모달의 검은 배경을 클릭하면 모달 닫기
    elements.modal.addEventListener('click', closeModal);

    // 작품 상세 모달 내부 박스를 클릭했을 때는 닫히지 않게 막음
    elements.modalBox.addEventListener('click', event => {
        event.stopPropagation();
    });

    // 작품 상세 모달 X 버튼 클릭 시 모달 닫기
    elements.modalCloseBtn.addEventListener('click', event => {
        event.stopPropagation();
        closeModal();
    });
}


// HTML에 그대로 넣으면 문제가 될 수 있는 특수문자를 안전한 문자로 바꾸는 함수
// 예: <, > 같은 문자가 HTML 태그로 해석되는 것을 방지
function escapeHTML(text) {
    return String(text)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}