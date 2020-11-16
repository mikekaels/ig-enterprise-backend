import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, getRepository } from 'typeorm';
import { BookMark } from '../shared/entity/bookmark.entity';
import { AccountType, User, UserStatus } from '../shared/entity/users.entity';
import { CreateBookMarkDto } from './dto/create-bookmark.dto';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { Post } from '../shared/entity/post.entity';
import { CreateUserDto } from './dto/create-users.dto';
import { Gender } from '../shared/entity/gender.entity';
import { City } from '../shared/entity/city.entity';
import * as admin from 'firebase-admin';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(BookMark)
    private readonly bookMarkRepository: Repository<BookMark>,
  ) { }

  async saveBookMark(createBookMarkDto: CreateBookMarkDto): Promise<any> {
    try {
      let bookMark = new BookMark();
      bookMark.createdAt = createBookMarkDto.createdAt == null ? new Date() : moment(createBookMarkDto.createdAt).toDate();
      bookMark.postId = createBookMarkDto.postId;
      bookMark.userId = createBookMarkDto.userId;
      bookMark = await this.bookMarkRepository.save(bookMark);
      await getRepository(Post)
        .createQueryBuilder()
        .relation(Post, "bookMark")
        .of(bookMark.postId)
        .add(bookMark);
      return { status: "success" };
    } catch (err) {
      return { message: "save bookmark fail, please try again" };
    }
  }

  async removeBookMark(createBookMarkDto: CreateBookMarkDto): Promise<any> {
    try {
      let bookMark = new BookMark();
      bookMark.postId = createBookMarkDto.postId;
      bookMark.userId = createBookMarkDto.userId;
      bookMark = await this.bookMarkRepository.findOne(bookMark);
      await getRepository(Post)
        .createQueryBuilder()
        .relation(Post, "bookMark")
        .of(bookMark.postId)
        .remove(bookMark.id);
      await this.bookMarkRepository.delete(bookMark);

      return { status: "success" };
    } catch (err) {
      return { message: "unsave bookmark fail, please try again" };
    }
  }

  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async searchUser(search: string, id: number): Promise<User[]> {
    const searchPattern = "%" + search + "%";
    return await getRepository(User)
      .createQueryBuilder("user")
      .where("user.id != :id", { id: id })
      .andWhere("user.status = 'A'")
      .andWhere("user.tagged != 'D'")
      .andWhere("user.fullname like :fullname", { fullname: searchPattern })
      .andWhere("user.username like :username", { username: searchPattern })
      .getMany();
  }

  async searchShareUser(search: string, id: number): Promise<User[]> {
    const searchPattern = "%" + search + "%";
    return await getRepository(User)
      .createQueryBuilder("user")
      .where("user.id != :id", { id: id })
      .andWhere("user.status = 'A'")
      .andWhere("user.replies = true")
      .andWhere("user.fullname like :fullname", { fullname: searchPattern })
      .orWhere("user.username like :username", { username: searchPattern })
      .getMany();
  }

  async findOne(findData: FindConditions<User>): Promise<User> {
    return await this.usersRepository.findOne(findData);
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await await this.usersRepository.delete(id);
  }

  async emailOrUsername(email: string, username: string): Promise<User> {
    return await getRepository(User)
      .createQueryBuilder("user")
      .where("user.email = :email", { email: email })
      .orWhere("user.username = :username", { username: username })
      .getOne();
  }

  async loadUserAndPostById(id: number): Promise<any> {
    return await this.usersRepository.find({
      where: { follower: id, status: 'A' },
      relations: ["post"]
    });
  }

  async loadProfile(id: number): Promise<any> {
    // return await this.usersRepository.find({
    //   where: { id: id, status: 'A' },
    //   relations: ["posts", "posts.user", "post", "post.user"]
    // });

    return await getRepository(User)
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.gender", "gender")
      .leftJoinAndSelect("users.city", "city")
      .leftJoinAndSelect("users.interest", "interest")
      .leftJoinAndSelect("users.post", "userTag")
      .leftJoinAndSelect("userTag.user", "userTagged")
      .leftJoinAndSelect("users.posts", "posts", "posts.status = 'A'")
      .leftJoinAndSelect("posts.user", "user")
      // .leftJoinAndSelect("users.post", "post", "post.status = 'A'")
      .where("users.id = :id", { id: id })
      .andWhere("users.status = 'A'")
      .orderBy("posts.createdAt", "DESC")
      .getMany();


  }

  async loadActivity(id: number): Promise<any> {
    return await getRepository(User)
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.posts", "posts", "posts.status = 'A'")
      .leftJoinAndSelect("users.following", "following", "following.status = 'A'")
      .leftJoinAndSelect("following.follower", "follower", "follower.status = 'A'")
      .leftJoinAndSelect("follower.posts", "post", "post.status = 'A'")
      .where("users.id = :id", { id: id })
      .andWhere("users.status = 'A'")
      .orderBy("posts.createdAt", "DESC")
      .getMany();



  }

  async loadProfileBookMark(id: number): Promise<any> {
    return await getRepository(Post)
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .leftJoinAndSelect("post.bookMark", "bookMark")
      .where("bookMark.userId = :id", { id: id })
      .orderBy("post.createdAt", "DESC")
      .getMany();
  }

  async updateSecondaryEmail(id: number, email: string): Promise<any> {
    const result = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.id != :id", { id: id })
      .andWhere("user.email = :email", { email: email })
      .orWhere("user.secondaryEmail = :semail", { semail: email })
      .getOne();

    if (result) {
      return { message: "This email is already in use, please try again" };
    }

    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ secondaryEmail: email })
      .where("id = :id", { id: id })
      .execute();
    return { status: "success", message: 'Update secondary email success' };
  }

  async updateUsername(id: number, username: string): Promise<any> {
    const result = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.id != :id", { id: id })
      .andWhere("user.username = :username", { username: username })
      .getOne();

    if (result) {
      return { message: "This username is already in use, please try again" };
    }

    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ username: username })
      .where("id = :id", { id: id })
      .execute();
    return { status: "success" };
  }

  async updateFullname(id: number, fullname: string): Promise<any> {
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ fullname: fullname })
      .where("id = :id", { id: id })
      .execute();
    return { status: "success" };
  }

  async updateBIO(id: number, bio: string): Promise<any> {
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ bio: bio })
      .where("id = :id", { id: id })
      .execute();
    return { status: "success" };
  }

  async updateWebsite(id: number, website: string): Promise<any> {
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ website: website })
      .where("id = :id", { id: id })
      .execute();
    return { status: "success" };
  }

  async updateGender(id: number, gender: Gender): Promise<any> {
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ gender: gender })
      .where("id = :id", { id: id })
      .execute();
    return { status: "success" };
  }

  async updateDOB(id: number, dob: string): Promise<any> {
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ dob: dob })
      .where("id = :id", { id: id })
      .execute();
    return { status: "success" };
  }

  async updateProfileImage(id: number, profileImageURL200X200: string, profileImageURL600X600: string, profileImageURL1080X1080: string): Promise<any> {
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ profileImageURL200X200: profileImageURL200X200, profileImageURL600X600: profileImageURL600X600, profileImageURL1080X1080: profileImageURL1080X1080 })
      .where("id = :id", { id: id })
      .execute();
    return { status: "success", message: 'Update profile image success' };
  }

  async updatePrivateAccount(id: number, accountType: string): Promise<any> {
    await this.usersRepository.update(id, { accountType: AccountType[accountType] });
    return { status: "success" };
  }

  async updateTagged(id: number, tagged: string): Promise<any> {
    await this.usersRepository.update(id, { tagged: tagged });
    return { status: "success" };
  }

  async updateReplies(id: number, replies: boolean): Promise<any> {
    await this.usersRepository.update(id, { replies: replies });
    return { status: "success" };
  }

  async updateAutoSavePost(id: number, autoSavePost: boolean): Promise<any> {
    await this.usersRepository.update(id, { autoSavePost: autoSavePost });
    return { status: "success" };
  }

  async updateNotification(id: number, newMessage: boolean, newFollowerRequest: boolean,
    taggedInPost: boolean, adminEmail: boolean, adminPush: boolean): Promise<any> {
    await this.usersRepository.update(id, {
      newMessage: newMessage, newFollowerRequest: newFollowerRequest,
      taggedInPost: taggedInPost, adminEmail: adminEmail, adminPush: adminPush
    });
    return { status: "success" };
  }

  async updatePassword(id: number, newPassword: string, currentPassword: string): Promise<any> {
    if (!newPassword.match('^(?=.*[a-z])(?=.*?[0-9]).{8,}$')) {
      return { message: "Min 8 character and 1 number" };
    }
    const user = await this.findById(id);
    if (!user) {
      return { message: "User not found please login again!" };
    }
    const validPass = await bcrypt.compare(currentPassword, user.passHash);
    if (user && validPass) {
      const passHash = await bcrypt.hash(newPassword, 10);
      await this.usersRepository.update(id, { passHash: passHash });
      await admin.auth().updateUser(user.fuid, {
        password: newPassword,
      });
      return { status: "success", message: 'Update password success' };
    }
    return { message: "Current password is not valid" };
  }

  async updateUID(id: number, uid: string): Promise<any> {
    await this.usersRepository.update(id, { fuid: uid });
    return { status: "success" };
  }

  async updateLocation(id: number, location: City): Promise<any> {
    await this.usersRepository.update(id, { city: location });
    return { status: "success" };
  }

  async getFirebaseUser(uid: string): Promise<any> {
    const userRecord = await admin.auth().updateUser(uid, {
      password: '12qwaszx',
    });

    return { status: "success", user: userRecord.toJSON() };

    // .then(function (userRecord) {
    //   // See the UserRecord reference doc for the contents of userRecord.
    //   console.log('Successfully updated user:', userRecord.toJSON());
    //   return { status: "success", user: userRecord.toJSON()};

    // })
    // .catch(function (error) {
    //   console.log('Error fetching user data:', error);
    // });
  }


}