


export const durationToSeconds = (iso) => {
  if (!iso || typeof iso !== "string") return 0;

  const match = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
};

export const parseDuration = (iso) => {
  if (!iso || typeof iso !== "string") return null;

  const match = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return null;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return `${hours ? hours + ':' : ''}${minutes
    .toString()
    .padStart(hours ? 2 : 1, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hh = hrs > 0 ? String(hrs).padStart(2, '0') + ':' : '';
  const mm = String(mins).padStart(2, '0') + ':';
  const ss = String(secs).padStart(2, '0');

  return hh + mm + ss;
}
