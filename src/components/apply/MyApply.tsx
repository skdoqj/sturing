import MyApplyCilent from './MyApplyCilent';

async function fetchStudyForm(id: string) {
  if (!id) throw new Error('Invalid ID');
  const res = await fetch(`${process.env.LOCAL_URL}/api/study-form/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch study form');
  return res.json();
}

export default async function MyApply({ id }: { id: string }) {
  const studyForm = await fetchStudyForm(id);
  console.log(studyForm, '📌');

  return <MyApplyCilent studyForm={studyForm} />;
}
