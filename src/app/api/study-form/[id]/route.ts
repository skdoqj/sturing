import connectDB from '@/lib/db';
import { StudyForm } from '@/lib/schemas/studyFormSchema';
import { StudyMember } from '@/lib/schemas/studyMemberSchema';
import { Study } from '@/lib/schemas/studySchema';
import { Types } from 'mongoose';
import { revalidatePath } from 'next/cache';

connectDB();

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    return Response.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const [studyForm] = await StudyForm.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'studies',
          localField: 'studyId',
          foreignField: '_id',
          as: 'study',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$study',
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          studyFormTitle: 1,
          studyFormContent: 1,
          studyFormRead: 1,
          studyFormSure: 1,
          createdAt: 1,
          updatedAt: 1,
          studyId: {
            _id: '$study._id',
            studyName: '$study.studyName',
          },
          userId: {
            _id: '$user._id',
            nickname: '$user.nickname',
            image: '$user.image',
            sturingPercent: '$user.sturingPercent',
            matchingInfo: '$user.matchingInfo',
          },
        },
      },
    ]);

    if (!studyForm) {
      return Response.json({ error: 'Study form not found' }, { status: 404 });
    }
    return Response.json(studyForm);
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const { action } = await request.json();

  if (!id) {
    return Response.json(
      { error: 'Study Form ID is required' },
      { status: 400 },
    );
  }

  try {
    const studyForm = await StudyForm.findById(new Types.ObjectId(id));

    if (action === 'view') {
      const updatedStudyForm = await StudyForm.findByIdAndUpdate(
        new Types.ObjectId(id),
        { studyFormRead: true },
        { new: true },
      );
      revalidatePath(`/my-study-list`);
      return Response.json({
        updatedStudyForm,
      });
    }

    if (action === 'accept') {
      const study = await Study.findById(studyForm.studyId);

      if (!study) {
        return Response.json(
          { error: '스터디를 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      if (study.studyJoinMember >= study.studyMember) {
        return Response.json(
          { error: '스터디 정원이 이미 꽉 찼습니다.' },
          { status: 400 },
        );
      }
      if (!studyForm.studyFormSure) {
        studyForm.studyFormSure = true;
        await studyForm.save();
        await StudyMember.create({
          studyId: studyForm.studyId,
          userId: studyForm.userId,
        });

        const updatedStudy = await Study.findByIdAndUpdate(
          studyForm.studyId,
          { $inc: { studyJoinMember: 1 } },
          { new: true },
        );

        if (updatedStudy.studyJoinMember > updatedStudy.studyMember) {
          await Study.findByIdAndUpdate(studyForm.studyId, {
            $inc: { studyJoinMember: -1 },
          });
          return Response.json(
            { error: '스터디 정원이 초과되었습니다.' },
            { status: 400 },
          );
        }
        revalidatePath('/my-study-list');
        return Response.json({ message: '이미 수락된 지원서입니다.' });
      } else {
        throw new Error('이미 수락한 지원서입니다.');
      }
    }

    if (!studyForm) {
      return Response.json(
        { error: '지원서를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: '이미 수락한 지원서입니다.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    return Response.json(
      { error: 'Study Form ID is required' },
      { status: 400 },
    );
  }

  try {
    await StudyForm.deleteOne({ _id: new Types.ObjectId(id) });

    revalidatePath('/my-study-list');
    return Response.json({ message: '지원이 거절되었습니다.' });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
