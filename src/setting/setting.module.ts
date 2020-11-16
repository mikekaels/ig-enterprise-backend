import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingService } from './setting.service';
import { UserInterest } from '../shared/entity/user_interest.entity';
import { Interest } from '../shared/entity/interest.entity';
import { SettingController } from './setting.controller';
import { Country } from '../shared/entity/country.entity';
import { Region } from '../shared/entity/region.entity';
import { City } from '../shared/entity/city.entity';
import { PostInterest } from '../shared/entity/post_interest.entity';
import { PostUserTag } from '../shared/entity/post_user_tag.entity';
import { HashTag } from '../shared/entity/hashtag.entity';
import { ReportPost } from '../shared/entity/report_post.entity';
import { Report } from '../shared/entity/report.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Report, ReportPost, HashTag,PostUserTag,PostInterest,UserInterest,Interest,Country,Region,City])],
    providers: [SettingService],
    exports: [SettingService],
    controllers: [SettingController],

})
export class SettingModule { }