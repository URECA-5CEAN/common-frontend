const STYLES = {
  spinner: 'w-full h-full flex justify-center items-center',
  spinnerDot:
    'w-5 h-5 border-3 border-gray-300 border-t-primaryGreen-80 rounded-full animate-spin',
};

export const LoadingSpinner = () => (
  <div className={STYLES.spinner}>
    <div className={STYLES.spinnerDot} />
  </div>
);
