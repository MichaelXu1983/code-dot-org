require 'singleton'
require 'aws-sdk-firehose'

# A wrapper client to the AWS Firehose service.
# @example
#   FirehoseClient.instance.put_record(
#     {
#       study: 'underwater basket weaving',
#       study_group: 'control',
#       script_id: script.id
#     }
#   )
#
# @example
#   FirehoseClient.instance.put_record_batch(
#     [
#       {
#         study: 'underwater basket weaving',
#         study_group: 'control',
#         script_id: script.id
#       }, ...
#     ]
#   )

STREAM_NAME = 'analysis-events'.freeze

class FirehoseClient
  include Singleton

  REGION = 'us-east-1'.freeze
  # Max number of records Firehose allows to be pushed in a batch.
  FIREHOSE_PUT_MAX_RECORDS = 500

  # Initializes the @firehose to an AWS Firehose client.
  def initialize
    if [:development, :test].include? rack_env
      return
    end
    @firehose = Aws::Firehose::Client.new(region: REGION)
  end

  def put_record_batch(datas)
    return if datas.nil_or_empty?
    return unless Gatekeeper.allows('firehose', default: true)

    # convert the given data into the format Firehose expects
    datas_with_common_values = []
    datas.each do |data|
      datas_with_common_values << {data: add_common_values(data)}
    end

    # don't update our Firehose tables on dev or test environments.
    if [:development, :test].include? rack_env
      CDO.log.info "Skipped sending record to #{STREAM_NAME}: "
      CDO.log.info datas
      return
    end

    # AWS Firehose batch_put has a limit on how many records can be uploaded
    # at once. This will break up the list of records in multiple lists of
    # the max batch size and then upload those.
    i = 0
    while i < datas_with_common_values.size
      # get a batch of records to send
      batch_end = i + FIREHOSE_PUT_MAX_RECORDS
      datas_with_common_values_batch = datas_with_common_values[i..batch_end]
      @firehose.put_record_batch(
        {
          delivery_stream_name: STREAM_NAME,
          records: datas_with_common_values_batch.to_json
        }
      )
      i += FIREHOSE_PUT_MAX_RECORDS
    end
  # Swallow and log all errors because an issue sending analytics should not prevent the caller from continuing.
  rescue StandardError => error
    # TODO(suresh): if the exception is Firehose ServiceUnavailableException, we should consider
    # backing off and retrying.
    # See http://docs.aws.amazon.com/sdkforruby/api/Aws/Firehose/Client.html#put_record-instance_method.
    Honeybadger.notify(error)
  end

  # Posts a record to the analytics stream.
  # @param data [hash] The data to insert into the stream.
  def put_record(data)
    put_record_batch([data])
  end

  private

  # Adds common key-value pairs to the data hash.
  # @param data [hash] The data to add the key-value pairs to.
  # @return [hash] The data, including the newly added key-value pairs.
  def add_common_values(data)
    data_with_common_values = data.merge(
      created_at: DateTime.now,
      environment: rack_env,
      device: 'server-side'.to_json
    )
    data_with_common_values[user_id] ||= current_user.id if current_user
    data_with_common_values
  end
end
