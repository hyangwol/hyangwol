/* main.js: 동적 상호작용과 로직을 담당하는 독립된 문서 */

document.addEventListener('DOMContentLoaded', async () => {
    /**
     * 페이지 로드 시 최상위 레이아웃인 헤더의 정렬을 완결한 후 
     * 하위 콘텐츠 및 사이드바 로직을 순차적으로 실행하여 
     * 렌더링 간섭으로 인한 레이아웃 붕괴를 원천적으로 방지함.
     */

    // --- 설정 정보 (달내의 환경에 맞게 수정 필요) ---
    // GitHub API 호출을 위한 기본 정보와 메뉴 구성을 위한 폴더 목록을 정의합니다.
    const GITHUB_USER = "hyangwol"; // 사용자 계정명
    const GITHUB_REPO = "hyangwol.github.io"; // 저장소 이름
    const ROOT_DATA_PATH = "data"; // 하위 폴더들을 읽어올 상위 데이터 폴더 경로

    // --- DOM 요소 참조 ---
    // 동적으로 생성된 버튼과 파일 목록이 삽입될 HTML 요소를 사전에 참조합니다.
    const folderMenu = document.querySelector('.folder-menu'); // 헤더 중앙 메뉴 영역
    const sidebarL1 = document.getElementById('sidebar-left-1'); // 1차 좌측 사이드바 (파일 목록 출력)
    const sidebarL2 = document.getElementById('sidebar-left-2'); // 여기로 이동
    const sidebarR = document.getElementById('sidebar-right');   // 여기로 이동
    const btnL1 = document.getElementById('toggle-sidebar-l1');   // 버튼들도 위로 이동
    const btnL2 = document.getElementById('toggle-sidebar-l2');
    const btnR2 = document.getElementById('toggle-sidebar-r2');
    const header = document.getElementById('header');          // 두대신축 기능을 위한 헤더 참조
    const btnHeader = document.getElementById('toggle-header'); // 두대신축 버튼 참조

    /**
     * GitHub API를 호출하여 특정 경로의 콘텐츠 목록을 가져오는 비동기 함수
     * @param {string} path - 저장소 내 폴더 경로
     * @returns {Promise<Array>} - 파일/폴더 정보 배열
     */
    async function fetchRepoContents(path = "") {
        try {
            // fetch API를 사용하여 GitHub REST API 서버에 데이터를 요청합니다.
            const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}`);
            
            // 응답이 성공적이지 않을 경우 에러를 발생시켜 catch 블록으로 전달합니다.
            if (!response.ok) throw new Error("네트워크 응답에 문제가 있습니다.");
            
            // 응답받은 JSON 데이터를 파싱하여 반환합니다.
            return await response.json();
        } catch (error) {
            // 네트워크 오류나 잘못된 경로 요청 시 콘솔에 에러를 기록하고 빈 배열을 반환합니다.
            console.error("데이터 호출 실패:", error);
            return [];
        }
    }

    // 앵커 링크 로직
    const anchorLinks = document.querySelectorAll('.anchor-link');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 향후 분석이나 커스텀 스크롤 로직이 필요할 경우 이곳에 추상화하여 구현
            console.log(`Anchor clicked: ${link.getAttribute('href')}`);
        });
    });

    // 키보드keyboard 단축短縮키key 로직logic
    document.addEventListener('keydown', (e) => {
        // 입력入力 요소要素에서 포커스focus 중일 때는 단축短縮키key 무효화無效化
        const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
        if (isInput) return;

        // 키key 값value을 소문자小文字로 통일統一
        const key = e.key.toLowerCase();

        // Alt 조합組合 또는 단독單獨 키key 입력入力 처리處理
        // else if를 사용하여 Alt+key와 단독單獨 key가 중복重複 실행實行되는 것을 방지防止
        if (e.altKey || true) { // 단독單獨 입력入力도 허용許容하기 위해 항상恒常 진입進入하되 내부內部에서 분기分岐
            switch (key) {
                case 'a': // Alt+A 또는 A
                    btnL1.click();
                    break;
                case 's': // Alt+S 또는 S
                    btnL2.click();
                    break;
                case 'l': // Alt+L 또는 L
                    btnR2.click();
                    break;
                case 'h': // Alt+H 또는 H (두대신축)
                case 'g': // Alt+G 또는 G (두대신축)
                case 't': // Alt+T 또는 T (두대신축)
                case 'y': // Alt+Y 또는 Y (두대신축)
                    if (btnHeader) btnHeader.click();
                    break;
            }
        }
    });

    // 저작권 연도 자동 갱신 (안전하게 DOM 로드 후 실행)
    const yearElement = document.getElementById("current-year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();            // 시스템의 현재 연도를 'current-year' 아이디를 가진 요소에 출력

    }

    /**
     * 헤더 중앙에 폴더별 메뉴 버튼을 동적으로 생성하는 함수 
     * 지정된 ROOT_DATA_PATH 내의 하위 폴더들을 조회하여 헤더 메뉴 버튼을 자동 생성합니다.
     * 달내가 폴더명들을 일일이 입력하지 않아도 폴더 구조를 읽어와 버튼화합니다.
     * 헤더 중앙에 폴더별 메뉴 버튼을 3층 구조로 균등하게 분배하여 생성하는 함수
     * 가장 짧은 줄(너비가 좁은 층)에 다음 버튼을 배치하여 시각적 균형을 유지함
     * 실제 버튼 너비를 측정하여 가장 짧은 층에 우선 배분하는 동적 평형 알고리즘
     * 1층(바닥)부터 데이터를 채우며, 폴더명 길이에 상관없이 시각적 균형을 유지함
     */
    async function initializeHeaderMenu() {
        if (!folderMenu) return;

        // 기존 메뉴 내용 및 구조 초기화
        // 기존 구조 초기화 및 시각적 적재를 위한 3개 층(Row) 생성
        folderMenu.innerHTML = '';
        const rows = [];
        for (let i = 0; i < 3; i++) {
            const row = document.createElement('div');
            row.className = 'menu-row';
        /* DOM 삽입 순서: rows[0], [1], [2] 순으로 삽입됨.
           CSS의 column-reverse 설정 덕분에 rows[0]이 화면 가장 아래(1층)에 위치하게 됨.
        */
            folderMenu.appendChild(row); 
            rows.push(row); // index 0: 1층, 1: 2층, 2: 3층
        }
        // API로부터 폴더 목록 호출 및 dir 타입 필터링
        // 데이터 호출 및 필터링
        const rootContents = await fetchRepoContents(ROOT_DATA_PATH);
        // 가져온 항목 중 '폴더(dir)'인 것만 골라냅니다.
        const subFolders = rootContents.filter(item => item.type === 'dir');

        // 실제 너비 측정을 위한 임시 컨테이너 생성 (화면 밖 배치)
        const tempContainer = document.createElement('div');
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.position = 'absolute';
        tempContainer.style.display = 'flex';
        document.body.appendChild(tempContainer);

        // 동적 너비 우선 분배 로직 실행
        subFolders.forEach(folder => {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'menu-item';
            menuBtn.textContent = folder.name;  // folder1, folder2 등이 버튼명이 됩니다.

            /**
             * 각 메뉴 버튼이 생성될 때마다 기준 색상(#ebf2ff)의 채도 비율을 계승한
             * 무작위 색상을 추출하여 버튼의 배경색(backgroundColor)으로 지정함.
             * 이를 통해 메뉴 로드 시마다 다채롭고 조화로운 파스텔톤 시각 효과를 제공함.
             */
            const randomBtnColor = getRandomColorBySaturationRatio('#ebf2ff');
            menuBtn.style.backgroundColor = randomBtnColor;

            // 버튼 클릭 시 해당 하위 폴더의 파일 목록을 호출합니다.
            // 클릭 이벤트: 파일 목록 렌더링 및 L1 사이드바 활성화
            // 클릭 이벤트 등록
            menuBtn.addEventListener('click', async () => {
                /**
                 * 새로운 폴더를 선택할 경우, 이전 문서의 맥락을 유지하지 않도록 
                 * 우측 사이드바의 목차(TOC) 내용을 즉시 초기화함.
                 */
                if (sidebarL2) sidebarL2.innerHTML = "";

                const files = await fetchRepoContents(folder.path);   // 폴더의 전체 경로 사용
                renderFileList(files);
                if (!sidebarL1.classList.contains('active')) sidebarL1.classList.add('active');
            });

            // [방법 A] 실제 너비 측정: 임시 컨테이너에 넣어 픽셀 너비를 구함
            tempContainer.appendChild(menuBtn);
            const btnWidth = menuBtn.offsetWidth + 1.3; // 버튼 너비 + 간격(gap)

            // 현재 3개 층 중 누적 너비가 가장 짧은 층 찾기
            let shortestRowIndex = 0;
            let minWidth = Infinity;

            rows.forEach((row, idx) => {
                // 각 층의 현재 자식 요소들의 너비 합산 계산
                const currentWidth = Array.from(row.childNodes).reduce((sum, child) => sum + child.offsetWidth + 1.3, 0);
                if (currentWidth < minWidth) {
                    minWidth = currentWidth;
                    shortestRowIndex = idx;
                }
            });

            // 가장 짧은 층에 실제 버튼 이동 배치
            rows[shortestRowIndex].appendChild(menuBtn);
        });

        // 빈 층 제거: 폴더가 3개 미만일 경우 불필요한 높이 차지를 막기 위해 빈 층 삭제
        // 작업 완료 후 임시 컨테이너 제거 및 빈 층 정리
        document.body.removeChild(tempContainer);
        rows.forEach(row => {
            if (row.childNodes.length === 0) row.remove();
        });
    }

    /**
     * 받아온 파일 목록 데이터를 L1 사이드바에 리스트 형태로 그리는 함수
     * @param {Array} files - GitHub API로부터 받은 파일 정보 객체 배열
     */
    function renderFileList(files) {
        if (!sidebarL1) return;
        
        sidebarL1.innerHTML = ""; // 새로운 목록을 그리기 전 기존 내용을 초기화합니다.
        const ul = document.createElement('ul');
        ul.style.listStyle = "none";
        ul.style.padding = "15px";

        files.forEach(file => {
            // GitHub 저장소의 폴더 내 파일 중 확장자가 .md인 파일만 선별하여 목록에 표시합니다.
            if (file.name.endsWith('.md')) {
                const li = document.createElement('li');
                li.style.marginBottom = "8px";

                const link = document.createElement('a');
                link.href = '#'; // 기본 링크 이동을 방지하기 위해 '#'으로 설정합니다.
                link.textContent = file.name.replace('.md', ''); // 사용자에게 보여줄 때 확장자는 제거합니다.
                link.style.textDecoration = "none";
                link.style.color = "#333";
                link.style.fontSize = "0.9em";
                link.style.cursor = "pointer";

                /**
                 * 파일명을 클릭했을 때 기본 동작(페이지 이동)을 차단하고, 
                 * 해당 파일의 경로(path)를 인자로 전달하여 본문 내용을 비동기로 호출함.
                 */
                link.onclick = (e) => {
                    e.preventDefault();
                    loadPostContent(file.path);
                };

                li.appendChild(link);
                ul.appendChild(li);
            }
        });

        sidebarL1.appendChild(ul);
    }

    // 헤더 메뉴의 물리적 정렬과 3층 적재가 완료될 때까지 대기하여 레이아웃 안정성을 확보함.
    await initializeHeaderMenu();

        /**
     * 상위 레이아웃(Header)이 확정된 시점에 개별 토글 버튼의 이벤트를 등록함.
     * 이는 초기 렌더링 시점에 발생할 수 있는 불필요한 레이아웃 재계산을 방지함.
     */
    // 사이드바(sidebar) 토글(toggle) 로직(logic)
    if (btnL1 && sidebarL1) btnL1.addEventListener('click', () => sidebarL1.classList.toggle('active'));
    if (btnL2 && sidebarL2) btnL2.addEventListener('click', () => sidebarL2.classList.toggle('active'));
    if (btnR2 && sidebarR) btnR2.addEventListener('click', () => sidebarR.classList.toggle('active'));

    // 두대신축(頭帶伸縮) 헤더 슬림 모드 토글 로직
    // 두대신축(頭帶伸縮) 버튼 클릭 시 헤더의 슬림 모드(slim-mode)를 토글함
    if (btnHeader && header) {
        btnHeader.addEventListener('click', () => {
            header.classList.toggle('slim-mode');
        });
    }

    // 다섯 개의 토글버튼 위에 마우스를 올렸을 때 툴팁 띄우는 기능.
    const tooltip = document.getElementById('custom-tooltip');
    const buttons = document.querySelectorAll('[data-tooltip]');

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            tooltip.textContent = btn.getAttribute('data-tooltip');
            tooltip.style.display = 'block';

            const gap = 15; // 마우스(mouse)와 툴팁(tooltip) 사이 간격(間隔)
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;

            // 기존(旣存) 위치(位置) 계산(計算) 및 경계(境界) 체크(check) 로직(logic) 전체(全體)를 아래로 교체(交替)
            let left = e.pageX + gap;
            let top = e.pageY + gap;

            // 오른쪽 경계(境界) 체크(check) (창 너비를 넘으면 왼쪽으로)
            if (left + tooltipWidth > window.innerWidth + window.scrollX) {
                left = e.pageX - tooltipWidth - gap;
            }
            // 왼쪽 경계(境界) 방어(防禦) (0보다 작아지면 0으로 고정)
            if (left < window.scrollX) {
                left = window.scrollX + 5;
            }

            // 아래쪽 경계(境界) 체크(check) (창 높이를 넘으면 위쪽으로)
            if (top + tooltipHeight > window.innerHeight + window.scrollY) {
                top = e.pageY - tooltipHeight - gap;
            }
            // 위쪽 경계(境界) 방어(防禦) (0보다 작아지면 0으로 고정)
            if (top < window.scrollY) {
                top = window.scrollY + 5;
            }

            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        });


        btn.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });

    /**
     * 특정 색상(色彩)의 채도(彩度) 수치(數値)를 기준(基準)으로 지정된 비율(比率) 범위(範圍) 내에서 색상(色相)을 무작위(無作爲) 추출(抽出)하는 함수(函數)
     * 입력(入力)받은 Hex 코드code의 채도(彩度)에 ±11%의 상대적(相對的) 편차(偏差)를 적용(適用)하여 원본(原本)의 선명도(鮮明度)를 유지(維持)하거나 변주(變奏)함.
     * @param {string} hex - 기준(基準)이 되는 십육진법(十六進法) 컬러color 코드code
     * @returns {string} - 원본(原本) 채도(彩度) 비율(比率)이 반영(反映)되어 생성(生成)된 무작위(無作爲) Hex 코드code
     */
    function getRandomColorBySaturationRatio(hex) {
        // 십육진법(十六進法)을 RGB 수치(數値)로 분해(分解) 및 정규화(正規化)
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;

        // RGB를 HSL 모델model로 변환(變換)하여 원본(原本) 채도(彩度)와 명도(明度) 확보(確保)
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let s, l = (max + min) / 2;

        if (max === min) {
            s = 0; // 무채색(無彩色)인 경우(境遇)
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        }

        // 색상(色相, Hue)은 0~360도(度) 범위(範圍)에서 무작위(無作爲) 추출(抽出)
        const randomHue = Math.floor(Math.random() * 361);

        // 채도(彩度, Saturation)에 기준(基準) 채도(彩度) 대비(對比) ±11%의 상대적(相對적) 비율(比率) 편차(偏差) 적용(適用)
        const ratio = 0.89 + (Math.random() * (1.11 - 0.89));
        let newSaturation = Math.min(1, s * ratio); // 물리적(物理的) 한계치(限界値) 100% 초과(超過) 방지(防止)

        // 명도(明度, Lightness)는 원본(原本) 색상(色彩)의 수치(數値)를 그대로 유지(維持)하여 시각적(視覺的) 일관성(一貫性) 확보(確保)
        const fixedLightness = l;

        // 최종(最終) 계산(計算)된 HSL 값을 다시 Hex 코드code로 변환(變換)하여 반환(返還)
        return hslToHex(randomHue, newSaturation * 100, fixedLightness * 100);
    }

    /**
     * HSL(색상, 채도, 명도) 수치(數値)를 표준(標準) Hex 컬러color 코드code로 변환(變換)하는 보조(補助) 함수(函數)
     * @param {number} h - 색상(色相) (0-360)
     * @param {number} s - 채도(彩도) (0-100)
     * @param {number} l - 명도(明度) (0-100)
     * @returns {string} - 변환(變換)된 Hex 문자열(文字列)
     */
    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    /**
     * 선택된 파일의 경로를 통해 GitHub API에서 원문 내용을 가져와 아티클 영역에 출력함.
     * GitHub API가 반환하는 Base64 데이터를 UTF-8 문자열로 안전하게 디코딩하여 한글 깨짐을 방지함.
     * @param {string} path - GitHub 저장소 내 파일 경로
     */
    async function loadPostContent(path) {
        const articleArea = document.getElementById('article');
        if (!articleArea) return;

        try {
            // 사용자에게 데이터를 불러오고 있음을 알리는 시각적 피드백 제공
            articleArea.innerHTML = '<p style="color: #666;">내용內容을 읽어오는 중中입니다...</p>';

            const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}`);
            if (!response.ok) throw new Error("파일file을 불러오는 데 실패失敗했습니다.");

            const data = await response.json();

            // GitHub API의 Base64 데이터를 UTF-8로 안전하게 디코딩 (한글 보존 로직)
            const decodedContent = decodeURIComponent(atob(data.content).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            /**
             * marked.js 라이브러리를 사용하여 디코딩된 마크다운 원문을 HTML로 변환함.
             * 이를 통해 제목, 목록, 강조 등 마크다운 문법이 시각적으로 완벽하게 렌더링됨.
             */
            articleArea.innerHTML = marked.parse(decodedContent);

             // 새로운 내용을 불러온 후 스크롤 위치를 본문 최상단으로 초기화
             articleArea.scrollTop = 0;

            // 본문 렌더링 완료 후 L2 사이드바에 목차(TOC) 생성
            renderTableOfContents();

        } catch (error) {
            console.error("콘텐츠content 로드load 실패失敗:", error);
            articleArea.innerHTML = '<p style="color: red;">내용內容을 불러오는 중中 오류誤謬가 발생發生했습니다.</p>';
        }
    }

    /**
     * 본문(article) 내의 제목 요소들을 분석하여 L2 사이드바에 목차(TOC)를 동적으로 생성하는 함수
     * h1, h2, h3 태그를 탐색하여 위계별로 들여쓰기가 적용된 링크 리스트를 구성함
     */
    function renderTableOfContents() {
        if (!sidebarL2) return;

        // 기존 목차 내용 초기화
        sidebarL2.innerHTML = "";
        const articleArea = document.getElementById('article');
        if (!articleArea) return;

        /**
         * 문서의 전체 구조를 상세히 파악할 수 있도록 
         * 최상위 제목(h1)부터 최하위 세부 제목(h6)까지 모두 탐색하여 목차에 포함함.
         */
        const headings = articleArea.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) return;

        const tocContainer = document.createElement('div');
        /**
         * 1위계 제목이 첫 번째 안내선과 일치하도록 좌측 패딩을 제거함.
         * 전체적인 시각적 밀도를 높이기 위해 상하좌우 여백을 최소화함.
         */
        tocContainer.style.padding = "10px 2px 10px 0";
        /**
         * 목차의 계층 구조를 시각적으로 분별하기 위해 배경에 가느다란 수직 안내선을 배치함.
         * repeating-linear-gradient를 사용하여 12px(들여쓰기 단위)마다 1px 두께의 선이 반복되도록 함.
         * 이 방식은 단일 그라디언트보다 계층 간격의 시각적 일관성을 유지하는 데 유리함.
         */
        tocContainer.style.backgroundImage = `
            repeating-linear-gradient(
                to right,
                #e3c0ff,
                #e3c0ff 1px,
                transparent 1px,
                transparent 12px
            )
        `;
        /**
         * 안내선의 노출 범위를 왼쪽으로부터 최대 6개(72px)로 제한. 
         * 배경의 전체 크기를 72px로 고정하고 반복을 해제함으로써 7번째 선부터는 노출되지 않도록 제어함.
         */
        tocContainer.style.backgroundSize = "72px 100%";
        tocContainer.style.backgroundRepeat = "no-repeat";

        headings.forEach((heading, index) => {
            // 제목 텍스트에서 클립링크 등 자식 요소 제외하고 순수 텍스트만 추출
            const titleText = heading.childNodes[0]?.textContent?.trim() || heading.textContent.trim();
            
            // 제목에 id가 없는 경우 목차 연결을 위해 임시 식별자를 자동 부여함
            if (!heading.id) {
                heading.id = `toc-heading-${index}`;
            }
            const id = heading.id;

            // 식별자(id)가 확보되었으므로 목차 항목(link) 생성
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = titleText;
            link.style.textDecoration = "none";
            link.style.color = "#555";
            link.style.fontSize = "0.85em";
            /**
             * 코드 에디터와 유사한 조밀한 가독성을 위해 하단 여백을 제거하고 줄 높이를 최적화함.
             * 배경색 마스킹이 상하로 미세하게 겹쳐 안내선이 끊김 없이 이어지도록 조정함.
             */
            link.style.marginBottom = "0";
            link.style.lineHeight = "1.2";

            /**
             * 안내선이 텍스트 아래에 겹쳐 가독성을 해치지 않도록 
             * 링크 항목 자체에 배경색을 부여하여 선을 가려주는 마스킹 효과를 적용함.
             * 들여쓰기 안내선이 글자 시작 지점 전(왼쪽)까지는 온전히 노출되도록 함.
             * 배경색을 글자 너비만큼만 적용하기 위해 display를 inline-block으로 설정하고,
             * 텍스트 영역에만 배경색을 부여하여 가이드라인을 마스킹(masking)함.
             */
            link.style.display = "inline-block";
            link.style.backgroundColor = "#fff";
            link.style.position = "relative";
            /**
             * 글자가 시작되는 정확한 지점에서 안내선이 겹치도록 좌측 패딩을 제거함.
             * 배경색이 글자 끝부분에서 너무 급격히 끊기지 않도록 우측에만 최소한의 여백을 유지함.
             */
            /**
             * 글자가 시작되는 정확한 지점에서 안내선이 겹치도록 좌측 패딩을 제거함.
             * 우측 여백을 미미하게 설정하여 박스 내 공간 낭비를 방지함.
             */
            link.style.paddingLeft = "0";
            link.style.paddingRight = "0.6px";

            /**
             * 제목 위계(h1~h6)에 따른 좌측 들여쓰기 차등 적용.
             * (level - 1) 계산을 통해 h1(1위계)은 marginLeft가 0이 되어 첫 번째 선에 위치함.
             */
            const level = parseInt(heading.tagName.substring(1));
            link.style.marginLeft = `${(level - 1) * 12}px`;

            // 목차 항목 클릭 시 해당 위치로 부드럽게 이동하도록 설정
            link.onclick = (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth' });
            };

            /**
             * inline-block 요소인 링크가 가로로 나열되는 것을 방지하고 
             * 개별 항목이 독립된 행을 점유하도록 블록 레벨 컨테이너로 감싸 구성함.
             * 개별 항목을 감싸는 컨테이너의 불필요한 여백을 제거하여 행간을 최소화함.
             * 이를 통해 목차 전체의 시각적 밀도를 높이고 계층 구조 파악을 용이케 함.
             */
            const itemWrapper = document.createElement('div');
            itemWrapper.style.margin = "0";
            itemWrapper.style.padding = "0";
            itemWrapper.style.lineHeight = "0"; // wrapper로 인한 추가 간격 발생 방지
            
            itemWrapper.appendChild(link);
            tocContainer.appendChild(itemWrapper);
        });


        sidebarL2.appendChild(tocContainer);

        /**
         * 본문 렌더링 직후 사이드바가 즉시 열릴 경우 발생하는 브라우저의 연산 부하를 
         * 분산시키기 위해 한 프레임의 가용 시간을 확보한 후 사이드바를 활성화함.
         */
        if (headings.length > 0) {
            setTimeout(() => {
                if (!sidebarL2.classList.contains('active')) {
                    sidebarL2.classList.add('active');
                }
            }, 1);
        }
    }
});
