/* main.js: 동적 상호작용과 로직을 담당하는 독립된 문서 */

document.addEventListener('DOMContentLoaded', () => {






















    
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

            // 버튼 클릭 시 해당 하위 폴더의 파일 목록을 호출합니다.
            // 클릭 이벤트: 파일 목록 렌더링 및 L1 사이드바 활성화
            // 클릭 이벤트 등록
            menuBtn.addEventListener('click', async () => {
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
                link.href = file.path; // API에서 제공하는 파일의 상대 경로를 연결합니다.
                link.textContent = file.name.replace('.md', ''); // 사용자에게 보여줄 때 확장자는 제거합니다.
                link.style.textDecoration = "none";
                link.style.color = "#333";
                link.style.fontSize = "0.9em";

                li.appendChild(link);
                ul.appendChild(li);
            }
        });

        sidebarL1.appendChild(ul);
    }

    // 페이지 로드 시 위에서 정의한 메뉴 초기화 로직을 즉시 실행합니다.
    initializeHeaderMenu();



     



















    





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




    



});



