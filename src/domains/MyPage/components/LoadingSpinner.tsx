const STYLES = {
  spinner: 'w-full h-full flex justify-center items-center absolute inset-0',
  spinnerDot:
    'w-full h-full rounded-full bg-gradient-to-r from-primaryGreen-40 via-primaryGreen-60 to-primaryGreen animate-spin relative',
  innerCircle: 'absolute inset-1 bg-white rounded-full',
};

export const LoadingSpinner = () => (
  <div className={STYLES.spinner}>
    <div className={STYLES.spinnerDot}>
      <div className={STYLES.innerCircle} />
    </div>
  </div>
);
