let singleton: ReturnType<typeof useWindowManager>
export default function () {
  return singleton || (singleton = useWindowManager())
}
