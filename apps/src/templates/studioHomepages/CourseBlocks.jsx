import $ from 'jquery';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ContentContainer from '../ContentContainer';
import CourseBlocksTools from './CourseBlocksTools';
import SpecialAnnouncement from './SpecialAnnouncement';
import CourseBlocksInternationalGradeBands from './CourseBlocksInternationalGradeBands';
import {NotificationResponsive} from '@cdo/apps/templates/Notification';
import ProtectedStatefulDiv from '../ProtectedStatefulDiv';
import i18n from '@cdo/locale';
import {pegasus} from '@cdo/apps/lib/util/urlHelpers';

class ExpressCourses extends Component {
  componentDidMount() {
    $('#pre-express')
      .appendTo(ReactDOM.findDOMNode(this.refs.pre_express))
      .show();
    $('#express')
      .appendTo(ReactDOM.findDOMNode(this.refs.express))
      .show();
  }

  render() {
    return (
      <ContentContainer
        heading={i18n.courseBlocksCsfExpressHeading()}
        description={i18n.courseBlocksCsfExpressDescription()}
      >
        <div className="row">
          <ProtectedStatefulDiv ref="pre_express" />
          <ProtectedStatefulDiv ref="express" />
        </div>
        <AcceleratedAndUnplugged />
      </ContentContainer>
    );
  }
}

class CoursesAToF extends Component {
  componentDidMount() {
    $('#coursea')
      .appendTo(ReactDOM.findDOMNode(this.refs.coursea))
      .show();
    $('#courseb')
      .appendTo(ReactDOM.findDOMNode(this.refs.courseb))
      .show();
    $('#coursec')
      .appendTo(ReactDOM.findDOMNode(this.refs.coursec))
      .show();
    $('#coursed')
      .appendTo(ReactDOM.findDOMNode(this.refs.coursed))
      .show();
    $('#coursee')
      .appendTo(ReactDOM.findDOMNode(this.refs.coursee))
      .show();
    $('#coursef')
      .appendTo(ReactDOM.findDOMNode(this.refs.coursef))
      .show();
  }

  render() {
    return (
      <div>
        <ContentContainer
          heading={i18n.courseBlocksCsfYoungHeading()}
          description={i18n.courseBlocksCsfYoungDescription()}
        >
          <div className="row">
            <ProtectedStatefulDiv ref="coursea" />
            <ProtectedStatefulDiv ref="courseb" />
          </div>
        </ContentContainer>

        <ContentContainer
          heading={i18n.courseBlocksCsfOlderHeading()}
          description={i18n.courseBlocksCsfOlderDescription()}
        >
          <div className="row">
            <ProtectedStatefulDiv ref="coursec" />
            <ProtectedStatefulDiv ref="coursed" />
            <ProtectedStatefulDiv ref="coursee" />
            <ProtectedStatefulDiv ref="coursef" />
          </div>
        </ContentContainer>
      </div>
    );
  }
}

const LegacyCSFNotification = () => (
  <NotificationResponsive
    type="bullhorn"
    notice={i18n.courseBlocksLegacyNotificationHeading()}
    details={i18n.courseBlocksLegacyNotificationBody()}
    detailsLinkText={i18n.courseBlocksLegacyNotificationDetailsLinkText()}
    detailsLink={pegasus('/educate/curriculum/csf-transition-guide')}
    detailsLinkNewWindow={true}
    dismissible={false}
    buttons={[
      {
        text: i18n.courseBlocksLegacyNotificationButtonCourses14(),
        link: pegasus('/educate/curriculum/cs-fundamentals-international'),
        newWindow: true
      },
      {
        text: i18n.courseBlocksLegacyNotificationButtonCoursesAccelerated(),
        link: '/s/20-hour',
        newWindow: true
      }
    ]}
  />
);

class Courses1To4 extends Component {
  componentDidMount() {
    $('#course1')
      .appendTo(ReactDOM.findDOMNode(this.refs.course1))
      .show();
    $('#course2')
      .appendTo(ReactDOM.findDOMNode(this.refs.course2))
      .show();
    $('#course3')
      .appendTo(ReactDOM.findDOMNode(this.refs.course3))
      .show();
    $('#course4')
      .appendTo(ReactDOM.findDOMNode(this.refs.course4))
      .show();
  }

  render() {
    return (
      <ContentContainer
        heading={i18n.csf()}
        description={i18n.csfDescription()}
        link={'/home/#recent-courses'}
        linkText={i18n.viewMyRecentCourses()}
      >
        <div className="row">
          <ProtectedStatefulDiv ref="course1" />
          <ProtectedStatefulDiv ref="course2" />
          <ProtectedStatefulDiv ref="course3" />
          <ProtectedStatefulDiv ref="course4" />
        </div>
      </ContentContainer>
    );
  }
}

class AcceleratedAndUnplugged extends Component {
  componentDidMount() {
    $('#20-hour')
      .appendTo(ReactDOM.findDOMNode(this.refs.twenty_hour))
      .show();
    $('#unplugged')
      .appendTo(ReactDOM.findDOMNode(this.refs.unplugged))
      .show();
  }

  render() {
    return (
      <div className="row">
        <ProtectedStatefulDiv ref="twenty_hour" />
        <ProtectedStatefulDiv ref="unplugged" />
      </div>
    );
  }
}

const ViewMoreTile = () => (
  <div className="tutorial-block">
    <div className="courseblock-span3 courseblock-tall">
      <a href={pegasus('/hourofcode/overview')}>
        <img src="/shared/images/more_arrow.png" width="100%" height="120px" />
        <div className="course-container">
          <h3 className="heading">{i18n.viewMore()}</h3>
          <div className="text smalltext">
            {i18n.teacherCourseHocLinkText()}
          </div>
        </div>
      </a>
    </div>
  </div>
);

export class CourseBlocks extends Component {
  static propTypes = {
    // Array of jQuery selectors to course blocks.
    tiles: PropTypes.arrayOf(PropTypes.string).isRequired,
    showViewMoreTile: PropTypes.bool
  };

  render() {
    return (
      <div className="tutorial-row">
        {this.props.tiles.map((tile, index) => (
          <ProtectedStatefulDiv
            className="tutorial-block"
            key={tile}
            ref={el => {
              if (el) {
                $(tile).appendTo(ReactDOM.findDOMNode(el));
              }
            }}
          />
        ))}

        {this.props.showViewMoreTile && <ViewMoreTile />}
      </div>
    );
  }
}

export class CourseBlocksHoc extends Component {
  static propTypes = {
    isInternational: PropTypes.bool
  };

  tiles() {
    return this.props.isInternational
      ? ['#dance-2019', '#aquatic', '#frozen']
      : ['#dance-2019', '#aquatic', '#oceans'];
  }

  render() {
    return (
      <ContentContainer
        heading={i18n.teacherCourseHoc()}
        description={i18n.teacherCourseHocDescription()}
        linkText={i18n.teacherCourseHocLinkText()}
        link={pegasus('/hourofcode/overview')}
      >
        <CourseBlocks tiles={this.tiles()} showViewMoreTile />
      </ContentContainer>
    );
  }
}

export class CourseBlocksIntl extends Component {
  static propTypes = {
    isTeacher: PropTypes.bool.isRequired,
    showModernElementaryCourses: PropTypes.bool.isRequired
  };

  componentDidMount() {
    $('.csf-courses-header')
      .appendTo(ReactDOM.findDOMNode(this.refs.csfCoursesHeader))
      .show();
  }

  render() {
    const {isTeacher, showModernElementaryCourses: modernCsf} = this.props;
    const AcceleratedCourses = () => (
      <ContentContainer>
        <AcceleratedAndUnplugged />
      </ContentContainer>
    );
    return (
      <div>
        {modernCsf ? <ExpressCourses /> : <AcceleratedCourses />}

        <CourseBlocksHoc isInternational />

        <SpecialAnnouncement isEnglish={false} isTeacher={isTeacher} />

        {modernCsf ? <CoursesAToF /> : <Courses1To4 />}

        {modernCsf && <LegacyCSFNotification />}

        <CourseBlocksInternationalGradeBands />

        <CourseBlocksTools isEnglish={false} />
      </div>
    );
  }
}
