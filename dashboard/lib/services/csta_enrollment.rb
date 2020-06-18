#
# As part of our Amazon Future Engineer partnership, teachers at eligible
# schools are offered a free CSTA+ membership. Our system expedites this
# process by automatically creating a submission to CSTA's enrollment form
# on the teacher's behalf.
#
# The CSTA form runs on JotForm, and we are using JotForm's public API to
# create new form submissions.  CSTA has provided us with a form ID and API key.
# See: https://api.jotform.com/docs/#post-form-id-submissions
#
class Services::CSTAEnrollment
  def initialize
    @client = Pd::JotForm::JotFormRestClient.new(CDO.csta_jotform_api_key)
  end

  def submit!(
    first_name:,
    last_name:,
    email:,
    school_district_name:,
    school_name:,
    street_1:,
    street_2:,
    city:,
    state:,
    zip:,
    csta_privacy_permission:
  )
    # Question ids as found in the test form
    # (We might need to retrieve these from the JotForm API, later)
    question_ids = {
      address: 17,
      email: 16,
      fullName: 15,
      iProvide: 19,
      pleaseState: 5,
      pleaseState18: 18
    }
    # Map answer to JotForm question ids
    payload = {
      "#{question_ids[:fullName]}_first" => first_name,
      "#{question_ids[:fullName]}_last" => last_name,
      question_ids[:email] => email,
      question_ids[:pleaseState] => school_district_name,
      question_ids[:pleaseState18] => school_name,
      "#{question_ids[:address]}_st1" => street_1,
      "#{question_ids[:address]}_st2" => street_2,
      "#{question_ids[:address]}_city" => city,
      "#{question_ids[:address]}_state" => state,
      "#{question_ids[:address]}_zip" => zip,
      question_ids[:iProvide] => csta_privacy_permission
    }
    @client.add_submission_to_form(CDO.csta_jotform_form_id, payload)
  end
end
