import * as React from "react";

interface DinosaurProps {
  className?: string;
}

const DinosaurIcon = (props: DinosaurProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    data-testid="dinosaur-icon"
    {...props}
  >
    <path d="m236.375 34.5-18.53 2.406 5.06 39.407c-9.114 1.973-18.22 4.657-27.28 8.062l-9.5-40.156-18.188 4.31 10.25 43.345a218.543 218.543 0 0 0-25.093 14.344l-17.28-42.876L118.5 70.31l19.03 47.22a206.258 206.258 0 0 0-14.25 12.468L89.47 89.625l-14.345 12 35.22 42.063a195.014 195.014 0 0 0-12.97 16.78L53.47 133.5l-9.782 15.938 43.874 26.906a193.797 193.797 0 0 0-9.812 20.53l-47.53-12.81-4.845 18.06L71.5 214.532a200.305 200.305 0 0 0-7.344 36.345l-39.656-2.25-1.03 18.688 39.56 2.218a207.24 207.24 0 0 0 2.47 35.19L31.375 311l3.375 18.375 34.47-6.344c2.885 11.524 6.74 22.782 11.56 33.595l-26.31 11.97 7.75 17 27-12.283A192.58 192.58 0 0 0 110 403.126l-20.53 16.813 11.843 14.468 21.5-17.625a184.811 184.811 0 0 0 29.406 23.126L141.53 456l15.564 10.344 11.437-17.22c11.12 5.558 23.014 10.1 35.626 13.47l3.563-17.72c-10.315-2.77-20.055-6.39-29.19-10.812l7.47-11.25-15.563-10.343-8.28 12.467c-9.12-5.807-17.506-12.456-25.157-19.78l13.906-11.407-11.844-14.438-14.843 12.157a177.534 177.534 0 0 1-18-25.908l22.5-10.25-7.75-17-23.19 10.563a188.384 188.384 0 0 1-10.218-29.22l32.313-5.967-3.375-18.375-32.72 6.03a188.112 188.112 0 0 1-2.25-30.78l40.032 2.25 1.063-18.657-39.97-2.25c.73-6.54 1.805-13.07 3.25-19.53 4.226.572 9.16 1.176 15.064 1.843 14.326 1.616 32.835 3.446 51.155 5.186 29.98 2.848 49.638 4.533 59.375 5.375l-33.063 72.345-5.78 12.656 1.343.064L234.563 365l9.406-16.156-29.94-17.375 51.782 2.092.75-18.687-49.343-2 33.593-13.22-6.844-17.405-35.407 13.938L234 240.53l5.5-12.06-13.22-1.126s-35.88-3.062-72.405-6.53c-18.263-1.736-36.696-3.565-50.813-5.158-4.618-.52-8.52-1.014-12.03-1.47 9.83-29.017 27.474-56.23 53.812-78.5l20.937 52 17.345-7-22.875-56.75c.296-.202.578-.42.875-.624a207.016 207.016 0 0 1 21.47-12.812l18.874 79.906 18.186-4.28-19.72-83.5c8.432-3.326 16.87-5.95 25.314-7.876l11.78 91.75 18.532-2.375-11.875-92.53c8.964-1.012 17.896-1.247 26.75-.814l3 96.19 18.688-.595-.344-11.25 34.22 39.28-37.28 17.064 7.78 17 32.313-14.782-15.688 32.343 16.813 8.19L353.344 226l2.72-5.563-4.064-4.656-41.375-47.468 50.53-47.843c23.78 15.006 45.428 35.18 63.533 59.343-23.814 6.14-44.022 24.153-50.688 53.718l47 103.064 16.875-2.406-26.938-68.625 17.407-6.844 28.562 72.75 34.813-5-8.408-138.626c-11.76-6.55-24.637-9.992-37.312-10.375a280.675 280.675 0 0 0-14.47-19.19l18.564-18.686-13.25-13.156-17.72 17.812a260.514 260.514 0 0 0-15.78-15.28l18.125-27.314-15.595-10.312-17 25.656a238.895 238.895 0 0 0-18.656-12.906l10.56-31.844-17.75-5.875-9.374 28.28a216.306 216.306 0 0 0-21.906-9.75l3.156-33.686-18.625-1.75-2.75 29.5a195.525 195.525 0 0 0-24.905-5.126l-.938-30.188L269 44.22l.875 27.936c-1.664-.064-3.33-.105-5-.125-1.19-.013-2.37-.007-3.563 0-6.633.05-13.29.455-19.968 1.22l-4.97-38.75zm52.844 58.22a179.002 179.002 0 0 1 22.53 5.155l-4.438 47.406.407.032-16.376 15.5-2.125-68.093zm40.717 11.56a198.143 198.143 0 0 1 14.25 6.532l-16.312 15.438 2.063-21.97zM441.5 195.5c.786-.023 1.572.006 2.375.063 12.852.9 22.34 11.843 21.438 24.687-.902 12.84-11.836 22.34-24.688 21.438-12.852-.902-22.34-11.848-21.438-24.688.845-12.037 10.52-21.152 22.313-21.5zM328.25 439.563a292.03 292.03 0 0 1-15.625 4.28l4 18.282c5.63-1.356 11.322-2.9 17.094-4.656l-5.47-17.908zm-33.906 8.093a238.418 238.418 0 0 1-20.97 2.656l.376 18.532a250.825 250.825 0 0 0 24.563-2.938l-3.97-18.25zM226 448.75l-3.594 17.78c10.464 1.76 21.356 2.75 32.656 2.876l-.375-18.344c-9.96-.06-19.515-.87-28.687-2.312z" />
  </svg>
);
export default DinosaurIcon;