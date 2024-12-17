"use client";

import { iconPropsInterface } from "@/interfaces";

const LogoIcon: React.FC<iconPropsInterface> = ({
  fill = "white",
  className,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="108"
      height="17"
      viewBox="0 0 108 17"
      fill="none"
      className={className}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <path
        d="M95.5469 16.2868V0.275391H102.75C103.484 0.275391 104.141 0.397731 104.722 0.642413C105.319 0.871803 105.824 1.20824 106.236 1.65173C106.649 2.07992 106.963 2.59987 107.177 3.21158C107.391 3.82328 107.498 4.49616 107.498 5.2302C107.498 5.97954 107.391 6.66007 107.177 7.27177C106.963 7.86818 106.649 8.38813 106.236 8.83162C105.824 9.25981 105.319 9.59625 104.722 9.84093C104.141 10.0703 103.484 10.185 102.75 10.185H98.5748V16.2868H95.5469ZM98.5748 7.56998H102.474C103.056 7.56998 103.514 7.41705 103.851 7.1112C104.187 6.79005 104.355 6.33892 104.355 5.7578V4.70261C104.355 4.12149 104.187 3.678 103.851 3.37215C103.514 3.0663 103.056 2.91337 102.474 2.91337H98.5748V7.56998Z"
        fill={fill}
      />
      <path
        d="M85.5047 16.5619C84.4495 16.5619 83.4937 16.3861 82.6373 16.0343C81.7809 15.6826 81.0469 15.155 80.4352 14.4515C79.8388 13.7481 79.3723 12.884 79.0359 11.8594C78.6995 10.8348 78.5312 9.64201 78.5312 8.28096C78.5312 6.93521 78.6995 5.75003 79.0359 4.72542C79.3723 3.68553 79.8388 2.81384 80.4352 2.11038C81.0469 1.40692 81.7809 0.879327 82.6373 0.527596C83.4937 0.175865 84.4495 0 85.5047 0C86.5599 0 87.5157 0.175865 88.3721 0.527596C89.2284 0.879327 89.9625 1.40692 90.5742 2.11038C91.1859 2.81384 91.6523 3.68553 91.9735 4.72542C92.3099 5.75003 92.4781 6.93521 92.4781 8.28096C92.4781 9.64201 92.3099 10.8348 91.9735 11.8594C91.6523 12.884 91.1859 13.7481 90.5742 14.4515C89.9625 15.155 89.2284 15.6826 88.3721 16.0343C87.5157 16.3861 86.5599 16.5619 85.5047 16.5619ZM85.5047 13.8781C86.6516 13.8781 87.5615 13.4958 88.2344 12.7311C88.9226 11.9665 89.2667 10.896 89.2667 9.51967V7.04226C89.2667 5.66592 88.9226 4.59544 88.2344 3.8308C87.5615 3.06617 86.6516 2.68386 85.5047 2.68386C84.3577 2.68386 83.4402 3.06617 82.752 3.8308C82.0791 4.59544 81.7427 5.66592 81.7427 7.04226V9.51967C81.7427 10.896 82.0791 11.9665 82.752 12.7311C83.4402 13.4958 84.3577 13.8781 85.5047 13.8781Z"
        fill={fill}
      />
      <path
        d="M72.4336 9.51979H65.7584V16.2868H62.7305V0.275391H65.7584V6.83593H72.4336V0.275391H75.4616V16.2868H72.4336V9.51979Z"
        fill={fill}
      />
      <path
        d="M53.6868 16.5619C52.3104 16.5619 51.1406 16.3172 50.1771 15.8279C49.229 15.3385 48.4108 14.6962 47.7227 13.901L49.7642 11.9283C50.3148 12.5705 50.9265 13.0599 51.5993 13.3963C52.2875 13.7328 53.0445 13.901 53.8703 13.901C54.8031 13.901 55.5066 13.7022 55.9807 13.3046C56.4547 12.8917 56.6918 12.3412 56.6918 11.653C56.6918 11.1177 56.5389 10.6819 56.233 10.3455C55.9272 10.009 55.3537 9.76435 54.5126 9.61142L52.9986 9.38203C49.8025 8.87737 48.2044 7.32517 48.2044 4.72542C48.2044 4.00667 48.3344 3.35673 48.5943 2.77561C48.8696 2.19449 49.2596 1.69748 49.7642 1.28458C50.2689 0.87168 50.8729 0.558181 51.5764 0.344084C52.2952 0.114695 53.1057 0 54.0079 0C55.216 0 56.2712 0.198804 57.1735 0.596413C58.0758 0.994021 58.848 1.58279 59.4903 2.36271L57.4258 4.31252C57.0282 3.82316 56.5465 3.42555 55.9807 3.1197C55.4148 2.81384 54.7037 2.66092 53.8474 2.66092C52.9757 2.66092 52.3181 2.82914 51.8746 3.16558C51.4464 3.48672 51.2323 3.9455 51.2323 4.54191C51.2323 5.15362 51.4082 5.60475 51.7599 5.89531C52.1116 6.18587 52.6775 6.39997 53.4574 6.5376L54.9484 6.81287C56.5694 7.10343 57.7623 7.62338 58.5269 8.37272C59.3068 9.10676 59.6968 10.139 59.6968 11.4695C59.6968 12.2341 59.5592 12.9299 59.2839 13.5569C59.0239 14.1686 58.634 14.7039 58.114 15.1626C57.6093 15.6061 56.9823 15.9502 56.233 16.1949C55.499 16.4396 54.6502 16.5619 53.6868 16.5619Z"
        fill={fill}
      />
      <path
        d="M43.4132 16.5388C42.7862 16.5388 42.3198 16.3859 42.014 16.0801C41.7234 15.7589 41.5781 15.3537 41.5781 14.8643V14.4514C41.5781 13.962 41.7234 13.5568 42.014 13.2356C42.3198 12.9145 42.7862 12.7539 43.4132 12.7539C44.0555 12.7539 44.522 12.9145 44.8125 13.2356C45.1031 13.5568 45.2484 13.962 45.2484 14.4514V14.8643C45.2484 15.3537 45.1031 15.7589 44.8125 16.0801C44.522 16.3859 44.0555 16.5388 43.4132 16.5388Z"
        fill={fill}
      />
      <path
        d="M29.4648 16.2868V0.275391H36.6677C37.4017 0.275391 38.0593 0.397731 38.6404 0.642413C39.2368 0.871803 39.7415 1.20824 40.1544 1.65173C40.5673 2.07992 40.8808 2.59987 41.0949 3.21158C41.309 3.82328 41.416 4.49616 41.416 5.2302C41.416 5.97954 41.309 6.66007 41.0949 7.27177C40.8808 7.86818 40.5673 8.38813 40.1544 8.83162C39.7415 9.25981 39.2368 9.59625 38.6404 9.84093C38.0593 10.0703 37.4017 10.185 36.6677 10.185H32.4928V16.2868H29.4648ZM32.4928 7.56998H36.3924C36.9735 7.56998 37.4323 7.41705 37.7687 7.1112C38.1052 6.79005 38.2734 6.33892 38.2734 5.7578V4.70261C38.2734 4.12149 38.1052 3.678 37.7687 3.37215C37.4323 3.0663 36.9735 2.91337 36.3924 2.91337H32.4928V7.56998Z"
        fill={fill}
      />
      <path
        d="M26.3543 16.2867H15.2518V13.4881L20.2755 9.08383C21.1318 8.33449 21.7588 7.66161 22.1565 7.0652C22.5541 6.45349 22.7529 5.79591 22.7529 5.09245V4.79424C22.7529 4.09078 22.5235 3.55554 22.0647 3.18851C21.6059 2.8062 21.0477 2.61504 20.3902 2.61504C19.5644 2.61504 18.9374 2.85208 18.5092 3.32615C18.081 3.78493 17.7751 4.34311 17.5916 5.00069L14.9766 3.99138C15.1448 3.45614 15.3818 2.95148 15.6877 2.47741C15.9935 1.98804 16.3758 1.55985 16.8346 1.19283C17.3087 0.825802 17.8592 0.535242 18.4862 0.321145C19.1132 0.107048 19.832 0 20.6425 0C21.4836 0 22.2329 0.122341 22.8905 0.367024C23.5481 0.596413 24.0986 0.925205 24.5421 1.3534C25.0009 1.78159 25.345 2.28625 25.5744 2.86737C25.819 3.44849 25.9414 4.08313 25.9414 4.7713C25.9414 5.44418 25.8343 6.05588 25.6202 6.60642C25.4061 7.15695 25.1156 7.68455 24.7486 8.18921C24.3815 8.67857 23.9533 9.15264 23.464 9.61142C22.9746 10.0549 22.4547 10.506 21.9041 10.9648L18.5321 13.7404H26.3543V16.2867Z"
        fill={fill}
      />
      <path
        d="M0.5 0.275391H7.90928C8.56686 0.275391 9.15563 0.374792 9.67558 0.573596C10.2108 0.7724 10.662 1.04767 11.029 1.3994C11.396 1.75113 11.6713 2.18697 11.8548 2.70692C12.0536 3.21158 12.153 3.76976 12.153 4.38146C12.153 4.99317 12.0689 5.51312 11.9007 5.94131C11.7477 6.35421 11.5336 6.6983 11.2584 6.97356C10.9984 7.24883 10.6925 7.45528 10.3408 7.59292C10.0044 7.73055 9.65264 7.80701 9.28562 7.82231V7.95994C9.63735 7.95994 10.012 8.02876 10.4096 8.16639C10.8225 8.30402 11.1972 8.52577 11.5336 8.83162C11.8854 9.12218 12.1759 9.5045 12.4053 9.97857C12.6347 10.4373 12.7494 11.0108 12.7494 11.699C12.7494 12.3413 12.6424 12.9453 12.4283 13.5112C12.2295 14.0617 11.9465 14.5434 11.5795 14.9563C11.2125 15.3692 10.7767 15.698 10.272 15.9427C9.76734 16.1721 9.2168 16.2868 8.62039 16.2868H0.5V0.275391ZM3.52794 13.7176H7.74871C8.32983 13.7176 8.78096 13.5723 9.10211 13.2818C9.42325 12.9759 9.58383 12.5401 9.58383 11.9743V11.1943C9.58383 10.6285 9.42325 10.1927 9.10211 9.88681C8.78096 9.58096 8.32983 9.42803 7.74871 9.42803H3.52794V13.7176ZM3.52794 6.95063H7.26699C7.81753 6.95063 8.24572 6.80535 8.55157 6.51479C8.85742 6.20893 9.01035 5.78839 9.01035 5.25314V4.54204C9.01035 4.00679 8.85742 3.59389 8.55157 3.30333C8.24572 2.99748 7.81753 2.84455 7.26699 2.84455H3.52794V6.95063Z"
        fill={fill}
      />
    </svg>
  );
};

export default LogoIcon;
