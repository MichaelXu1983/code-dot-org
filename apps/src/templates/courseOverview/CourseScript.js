import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import color from '@cdo/apps/util/color';
import i18n from '@cdo/locale';
import Button from '../Button';
import CourseScriptTeacherInfo from './CourseScriptTeacherInfo';
import AssignButton from '@cdo/apps/templates/AssignButton';
import {sectionForDropdownShape} from '@cdo/apps/templates/teacherDashboard/shapes';
import {ViewType} from '@cdo/apps/code-studio/viewAsRedux';
import {
  isScriptHiddenForSection,
  toggleHiddenScript
} from '@cdo/apps/code-studio/hiddenStageRedux';
import {sectionsForDropdown} from '@cdo/apps/templates/teacherDashboard/teacherSectionsRedux';
import firehoseClient from '@cdo/apps/lib/util/firehose';
import experiments from '@cdo/apps/util/experiments';
import FontAwesome from '@cdo/apps/templates/FontAwesome';

const styles = {
  main: {
    display: 'table',
    width: '100%',
    height: '100%',
    background: color.background_gray,
    borderWidth: 1,
    borderColor: color.border_gray,
    borderStyle: 'solid',
    borderRadius: 2,
    marginBottom: 12
  },
  content: {
    padding: 20
  },
  description: {
    marginTop: 20,
    marginBottom: 20
  },
  title: {
    fontSize: 18,
    fontFamily: '"Gotham 5r", sans-serif'
  },
  // TODO: share better with ProgressLesson
  hidden: {
    borderStyle: 'dashed',
    borderWidth: 4,
    marginTop: 0,
    marginBottom: 12,
    marginLeft: 0,
    marginRight: 0
  },
  assigned: {
    color: color.level_perfect,
    fontSize: 16,
    fontFamily: '"Gotham 5r", sans-serif',
    lineHeight: '36px',
    marginLeft: 10,
    verticalAlign: 'top'
  },
  flex: {
    display: 'flex'
  }
};

class CourseScript extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string,
    id: PropTypes.number.isRequired,
    courseId: PropTypes.number,
    description: PropTypes.string,
    assignedSectionId: PropTypes.number,

    // redux provided
    viewAs: PropTypes.oneOf(Object.values(ViewType)).isRequired,
    selectedSectionId: PropTypes.number.isRequired,
    hiddenStageState: PropTypes.object.isRequired,
    hasNoSections: PropTypes.bool.isRequired,
    toggleHiddenScript: PropTypes.func.isRequired,
    sectionsForDropdown: PropTypes.arrayOf(sectionForDropdownShape).isRequired
  };

  onClickHiddenToggle = value => {
    const {name, selectedSectionId, id, toggleHiddenScript} = this.props;
    toggleHiddenScript(name, selectedSectionId, id, value === 'hidden');
    firehoseClient.putRecord(
      {
        study: 'hidden-units',
        study_group: 'v0',
        event: value,
        script_id: id,
        data_json: JSON.stringify({
          script_name: name,
          section_id: selectedSectionId
        })
      },
      {useProgressScriptId: false}
    );
  };

  render() {
    const {
      title,
      name,
      id,
      description,
      viewAs,
      selectedSectionId,
      hiddenStageState,
      hasNoSections,
      assignedSectionId,
      courseId,
      sectionsForDropdown
    } = this.props;

    const isHidden = isScriptHiddenForSection(
      hiddenStageState,
      selectedSectionId,
      id
    );

    if (isHidden && viewAs === ViewType.Student) {
      return null;
    }

    const assignedToStudent = viewAs === ViewType.Student && assignedSectionId;
    const selectedSection = sectionsForDropdown.find(
      section => section.id === selectedSectionId
    );
    const assignedByTeacher =
      viewAs === ViewType.Teacher &&
      selectedSection &&
      selectedSection.scriptId === id;
    const isAssigned = assignedToStudent || assignedByTeacher;

    return (
      <div
        style={{
          ...styles.main,
          ...(isHidden && styles.hidden)
        }}
        className="uitest-CourseScript"
        data-visibility={isHidden ? 'hidden' : 'visible'}
      >
        <div style={styles.content}>
          <div style={styles.title}>{title}</div>
          <div style={styles.description}>{description}</div>
          <span style={styles.flex}>
            <Button
              text={i18n.goToUnit()}
              href={`/s/${name}${location.search}`}
              color={Button.ButtonColor.gray}
              className="uitest-go-to-unit-button"
            />
            {isAssigned &&
              experiments.isEnabled(experiments.ASSIGNMENT_UPDATES) && (
                <span style={styles.assigned}>
                  <FontAwesome icon="check" />
                  {i18n.assigned()}
                </span>
              )}
            {!isAssigned &&
              viewAs === ViewType.Teacher &&
              experiments.isEnabled(experiments.ASSIGNMENT_UPDATES) && (
                <AssignButton
                  sectionId={selectedSectionId}
                  scriptId={id}
                  courseId={courseId}
                />
              )}
          </span>
        </div>
        {viewAs === ViewType.Teacher && !hasNoSections && (
          <CourseScriptTeacherInfo
            disabled={!selectedSectionId}
            isHidden={isHidden}
            onToggleHiddenScript={this.onClickHiddenToggle}
          />
        )}
      </div>
    );
  }
}
export const UnconnectedCourseScript = CourseScript;

export default connect(
  (state, ownProps) => ({
    viewAs: state.viewAs,
    selectedSectionId: parseInt(state.teacherSections.selectedSectionId),
    sectionsForDropdown: sectionsForDropdown(
      state.teacherSections,
      ownProps.id,
      ownProps.courseId
    ),
    hiddenStageState: state.hiddenStage,
    hasNoSections:
      state.teacherSections.sectionsAreLoaded &&
      state.teacherSections.sectionIds.length === 0
  }),
  {toggleHiddenScript}
)(CourseScript);
